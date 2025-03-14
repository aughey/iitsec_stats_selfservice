# Created By: Anastacia "Stacy" MacAllister
# Created On: 03/14/2024 -> Happy Pie Day!!!!
# Description: This file contains functions to perform anlaysis for paper data coming from XCD

# Include the goodies we are going to need
import pandas as pd
import os

# Define the class and it's methods


class PaperAnalytics:

    # Define what it's constructor sets up
    def __init__(self):
        # Do something
        print("PaperAnalytics::__init__ - Initalizing a PaperAnalytics object")

    # Clean the data so it's usable -> TO DO: Add other data cleaning operations we want to do
    def cleanData(self, df_papers: pd, standard_variables_list: list):
        ######################
        # df_papers:pd -> DataFrame containing all the paper submissions
        # standard_variables_list:list -> List (it's really a dictionary so need to change this) storing all the names that we want to change into standard ones
        ######################

        # Let the user know we are cleaning the data
        print("PaperAnalytics::cleanData - Cleaning and formatting the paper data from XCD")

        # Replace the column names spaces with underscores since XCD likes to oddly throw in spaces
        df_papers.columns = df_papers.columns.str.replace(' ', '_')

        # Rename the variables using our standard mapping here
        df_papers = df_papers.rename(columns=standard_variables_list)

        # Replace any XCD values with our standard mapping key here
        df_papers = df_papers.replace(standard_variables_list)
        # print(standard_variables_list)

        # return the cleaned data with only the column names we care about
        return df_papers

    # Load in the file from xcd and return it
    def loadXCDFile(self, filePath: str, fileName: str):
        ##########################
        # filePath:str -> string containing the path to the file we want to load in
        # fileName:str -> string containing the actual file name we want to load
        # Note: Right now I'm being lazy adn passing it in all as one. Need to change
        ##########################

        print("PaperAnalytics::loadXCDFile - Loading file from XCD: ",
              str(filePath + fileName))

        # Load in the file and return it
        # TO DO: Add error handling for a non-existant file
        return pd.read_excel(filePath + fileName)

    # Calculate percentage of submissions by org
    def percentageSubmissionsByOrgType(self, df_papers: pd, fileName: str):
        ######################
        # df_papers:pd -> DataFrame containing all the paper submissions
        # fileName:str -> String containing the name of the file we want to save out
        ######################

        # Get the total number of unique submissions using ID as the key
        submission_count = df_papers["ID"].nunique()

        # Get only the unique submissions using ID as the key
        df_unique_submisisons = df_papers.drop_duplicates(subset=["ID"])

        # Group the papers by the submitter category
        pie_chart = df_unique_submisisons.groupby("Org_Type").size()

        # Convert the pie chart numbers to percentages
        pie_chart = pie_chart.divide(submission_count)

        # print("File Name: ", fileName)
        # print("Pie Chart: ", pie_chart)
        # cwd = os.getcwd()
        # print(cwd)

        # Save out the results
        # TO DO: Allow user to configure save location
        pie_chart.to_csv(fileName)

    # Run analysis right after abstract review closes to get our submission demographics
    def postAbstractSubmissionClosureAnalytics(self, filePathToAbstractSubmissionFile: str, listOfColumnAliases: dict):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("PaperAnalytics::postAbstractSubmissionClosure - Running the analysis for when abstract review closes.......")

        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_papers = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_papers = self.cleanData(df_papers, listOfColumnAliases)

        # Create the cross tabs by org
        self.twoFactorCrossTab(df_papers, "Assigned_Subcommittee",
                               "Org_Type", "Papers_AbstractReview_Crosstabs_OrgType.csv")

        # Compute the percentage submissions by org type
        self.percentageSubmissionsByOrgType(
            df_papers, "Papers_AbstractReview_PieChart.csv")

        # Compute the number of international submissions by subcommittee
        self.twoFactorCrossTab(df_papers, "International(Y/N)",
                               'Assigned_Subcommittee', "Papers_AbstractReview_Crosstabs_Intl.csv")

        # Compute where the authors are from for each subcommittee
        self.twoFactorCrossTab(df_papers, 'Origin_Country', 'Assigned_Subcommittee',
                               "Papers_AbstractReview_Crosstabs_Country.csv")

    # Analyze the acceptance numbers post abstract review
    def postAbstractReviewAcceptanceAnalytics(self, filePathToAbstractSubmissionFile: str, listOfColumnAliases: dict):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("PaperAnalytics::postAbstractReviewAcceptanceAnalytics - Running the analysis for post abstract review.......")

        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_records = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_records = self.cleanData(df_records, listOfColumnAliases)

        # Figure out how many papers each subcommittee accepted
        self.twoFactorCrossTab(df_records, "Assigned_Subcommittee", "Abstract_Accept_Reject",
                               "Papers_PostAbstractReview_Subcommittee_AcceptReject_Stats.csv")

        # Percentage of accepts by org type
        df_accepts = df_records[df_records["Abstract_Accept_Reject"]
                                == "Abstract_Accepted"]
        self.percentageSubmissionsByOrgType(
            df_accepts, "Papers_PostAbstractReview_OrgType_TotalAccepts.csv")

        # Percentage of rejects by org type
        df_rejects = df_records[df_records["Abstract_Accept_Reject"]
                                == "Abstract_Rejected"]
        self.percentageSubmissionsByOrgType(
            df_rejects, "Papers_PostAbstractReview_OrgType_TotalRejects.csv")

        # Figure out how many we rejected or accepted from each org type
        for current_subcommittee in df_records["Assigned_Subcommittee"].unique():

            # Grab the data for the current subcommitee
            df_current_subcommittee = df_records[df_records["Assigned_Subcommittee"] == str(
                current_subcommittee)]

            # Let's do a crosstab by org type and accept reject
            cross_tab_orgType = pd.crosstab(
                df_current_subcommittee["Org_Type"], df_current_subcommittee["Abstract_Accept_Reject"])

            # TO DO: Add in the percentage accept

            # Print out the cross tab file
            cross_tab_orgType.to_csv(
                "Papers_" + str(current_subcommittee) + "_Accept_Reject_ByOrg.csv")

            # Let's do a crosstab by international and accept/reject to figure out how all the intenat'l paper faired
            cross_tab_international = pd.crosstab(
                df_current_subcommittee["International(Y/N)"], df_current_subcommittee["Abstract_Accept_Reject"])

            # Print out the cross tab file
            cross_tab_international.to_csv(
                "Papers_" + str(current_subcommittee) + "_Accept_Reject_International.csv")

    # Analyze the acceptance numbers post abstract review
    def postPaperReviewAcceptanceAnalytics(self, filePath: str, listOfColumnAliases: dict):
        ###############################
        # filePath:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("PaperAnalytics::postPaperReviewAcceptanceAnalytics - Running the analysis for post paper review.......")

        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_records = self.loadXCDFile(filePath, "")

        # Clean the data and standardize the delimiters so we can use
        df_records = self.cleanData(df_records, listOfColumnAliases)

        # Figure out how many papers each subcommittee accepted
        self.twoFactorCrossTab(df_records, "Assigned_Subcommittee", "Paper_Accept_Reject",
                               "Papers_PostPaperReview_Subcommittee_AcceptReject_Stats.csv")

        # Percentage of accepts by org type
        df_accepts = df_records[df_records["Paper_Accept_Reject"]
                                == "Paper_Accepted"]
        print(df_accepts)
        self.percentageSubmissionsByOrgType(
            df_accepts, "Papers_PostPaperReview_OrgType_TotalAccepts.csv")

        # Percentage of rejects by org type
        df_rejects = df_records[df_records["Paper_Accept_Reject"]
                                == "Paper_Rejected"]
        self.percentageSubmissionsByOrgType(
            df_rejects, "Papers_PostPaperReview_OrgType_TotalRejects.csv")

        # Figure out how many we rejected or accepted from each org type
        for current_subcommittee in df_records["Assigned_Subcommittee"].unique():

            # Grab the data for the current subcommitee
            df_current_subcommittee = df_records[df_records["Assigned_Subcommittee"] == str(
                current_subcommittee)]

            # Let's do a crosstab by org type and accept reject
            cross_tab_orgType = pd.crosstab(
                df_current_subcommittee["Org_Type"], df_current_subcommittee["Paper_Accept_Reject"])

            # TO DO: Add in the percentage accept

            # Print out the cross tab file
            cross_tab_orgType.to_csv(
                "Papers_" + str(current_subcommittee) + "_Accept_Reject_ByOrg.csv")

            # Let's do a crosstab by international and accept/reject to figure out how all the intenat'l paper faired
            cross_tab_international = pd.crosstab(
                df_current_subcommittee["International(Y/N)"], df_current_subcommittee["Paper_Accept_Reject"])

            # Print out the cross tab file
            cross_tab_international.to_csv(
                "Papers_" + str(current_subcommittee) + "_Accept_Reject_International.csv")

        # Make a summary table for the final accept/rejects by country for each subcommittee
        df_records_accepts = df_records[df_records["Paper_Accept_Reject"]
                                        == "Paper_Accepted"]
        df_records_rejects = df_records[df_records["Paper_Accept_Reject"]
                                        == "Paper_Rejected"]

        # Let's do a crosstab to see the accepted numbers by country by committee
        cross_tab_accepted = pd.crosstab(
            df_records_accepts["Origin_Country"], df_records_accepts["Assigned_Subcommittee"])

        # Add the column for the toal
        cross_tab_accepted['Paper_Accepted'] = cross_tab_accepted.sum(axis=1)

        # Let's figure out the number of rejected
        cross_tab_rejected = pd.crosstab(
            df_records_rejects["Origin_Country"], df_records_rejects["Assigned_Subcommittee"])

        # Add the column for the toal
        cross_tab_rejected["Paper_Rejected"] = cross_tab_rejected.sum(axis=1)

        # Combine the dataframes so we can get the visual we need
        combined = pd.concat(
            [cross_tab_accepted, cross_tab_rejected["Paper_Rejected"]], axis=1)
        combined = combined.fillna(0)

        # Send this back so we can tabulate Papers, TUT, PDW accepts
        return combined

    # Analyze the reviews for the subcommittee
    def preAbstractReviewAnalytics(self, filePathToAbstractSubmissionFile: str, listOfColumnAliases: dict):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("PaperAnalytics::preAbstractReviewAnalytics - Running the analysis for pre abstract review.......")

        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_papers = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_papers = self.cleanData(df_papers, listOfColumnAliases)

        # Grab all the uniqe paper IDs and put them in an array
        papers_with_reviews = df_papers["ID"].unique()

        # Create a new data frame to store our results
        df_reviews_summary = pd.DataFrame(columns=["ID", "Title", "Birddog_Volunteer", "Assigned_Subcommittee",
                                                   "Mean_Substance_Rating", "Mean_Originality_Rating",
                                                   "Mean_Sales_Pitch", "Num_Accept", "Num_Reject", "Num_Discuss",
                                                   "Comments_for_Birddog", "Comments_for_Subcommittee"])

        # Cycle through all the unique IDs and populate the info
        for unique_id in papers_with_reviews:

            # Grab all the records for that ID
            df_current_paper = df_papers.loc[df_papers["ID"] == unique_id]

            # Grab the title of the paper
            record_title = df_current_paper["Title"].iloc[1]

            # Grab the list of birddog volunteers. This grabs all the records for a paper that someone responded yes to the birddog question
            birddog_volunteers_list = df_current_paper[df_current_paper["Birddog_Volunteer"] == "Yes"]

            # Combine the first and last name into a new column called "Combined_Name" so we can use it
            birddog_volunteers_list["Combined_Name"] = birddog_volunteers_list["ReviewerLastname"] + \
                ',' + birddog_volunteers_list["ReviewerFirstname"]

            # Change the data from a dataframe to a list of strings without the index number
            birddog_volunteers_list = birddog_volunteers_list["Combined_Name"].to_string(
                index=False)

            # Grab the subcommittee assignment
            assigned_subcommittee = df_current_paper["Assigned_Subcommittee"].iloc[1]

            # Calculate the mean substance rating
            mean_substance = round(
                df_current_paper.loc[:, "Substance_Rating"].mean(), 2)

            # Calculate the mean org rating
            mean_orig = round(
                df_current_paper.loc[:, "Originality_Rating"].mean(), 2)

            # Calculate mean sales pitch
            mean_sales_pitch = round(
                df_current_paper.loc[:, "Sales_Pitch"].mean(), 2)

            # Sum number of accepts
            num_accepts = df_current_paper[df_current_paper["Acceptance"] == "Accept"]
            num_accepts = len(num_accepts.index)

            # Sum number of rejects
            num_rejects = df_current_paper[df_current_paper["Acceptance"] == "Reject"]
            num_rejects = len(num_rejects.index)

            # Sum number of Discuss
            num_discuss = df_current_paper[df_current_paper["Acceptance"] == "Discuss"]
            num_discuss = len(num_discuss.index)

            # Grab comments for birddog
            list_comments_to_birddog = df_current_paper["Comments_for_Birddog"].tolist(
            )

            # Filter through list to make sure there are no empty junk values
            list_comments_to_birddog = [
                x for x in list_comments_to_birddog if str(x) != 'nan']

            # Grab comments to subcommittee
            list_comments_to_subcommittee = df_current_paper["Comments_for_Subcommittee"].tolist(
            )

            # Filter through list to make sure there are no empty junk values
            list_comments_to_subcommittee = [
                x for x in list_comments_to_subcommittee if str(x) != 'nan']

            # Add this record into the data frame
            df_new_entry = pd.DataFrame({"ID": unique_id,
                                         "Title": record_title, "Birddog_Volunteer": [birddog_volunteers_list],
                                         "Assigned_Subcommittee": assigned_subcommittee,
                                         "Mean_Substance_Rating": mean_substance,
                                         "Mean_Originality_Rating": mean_orig,
                                         "Mean_Sales_Pitch": mean_sales_pitch,
                                         "Num_Accept": num_accepts, "Num_Reject": num_rejects, "Num_Discuss": num_discuss,
                                         "Comments_for_Birddog": [list_comments_to_birddog],
                                         "Comments_for_Subcommittee": [list_comments_to_subcommittee]}, index=[0])
            # Add the record
            df_reviews_summary = pd.concat(
                [df_reviews_summary, df_new_entry], axis=0)  # .reset_index()

        # Save our our file with the review summary
        df_reviews_summary.to_csv("Papers_AbstractReviewSummary.csv")

     # Analyze the reviews for the subcommittee

    # Analyze reviews for the subcommittee before paper review
    def prePaperReviewAnalytics(self, filePath: str, listOfColumnAliases: dict):
        ###############################
        # filePath:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("PaperAnalytics::prePaperReviewAnalytics - Running the analysis for pre paper review.......")

        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_papers = self.loadXCDFile(filePath, "")

        # Clean the data and standardize the delimiters so we can use
        df_papers = self.cleanData(df_papers, listOfColumnAliases)

        # Grab all the uniqe paper IDs and put them in an array
        papers_with_reviews = df_papers["ID"].unique()

        # Create a new data frame to store our results
        df_reviews_summary = pd.DataFrame(columns=["ID", "Title", "Birddog", "Assigned_Subcommittee", "Num_Best_Paper_Votes",
                                                   "Mean_Substance_Rating", "Mean_Originality_Rating", "Mean_Style_Quality_Rating",
                                                   "Mean_Sales_Pitch", "Num_Accept", "Num_Reject", "Num_Discuss",
                                                   "Comments_for_Birddog", "Comments_for_Subcommittee"])

        # Cycle through all the unique IDs and populate the info
        for unique_id in papers_with_reviews:

            # Grab all the records for that ID
            df_current_paper = df_papers.loc[df_papers["ID"] == unique_id]

            # Grab the title of the paper
            record_title = df_current_paper["Title"].iloc[0]

            # Grab birddog
            birddog = df_current_paper["Birddog"].iloc[0]

            # Grab the subcommittee assignment
            assigned_subcommittee = df_current_paper["Assigned_Subcommittee"].iloc[0]

            # Calculate the mean substance rating
            mean_substance = round(
                df_current_paper.loc[:, "Substance_Rating"].mean(), 2)

            # Calculate the mean style quality rating
            mean_style_quality = round(
                df_current_paper.loc[:, "Quality_Rating"].mean(), 2)

            # Calculate the mean org rating
            mean_orig = round(
                df_current_paper.loc[:, "Originality_Rating"].mean(), 2)

            # Calculate mean sales pitch
            mean_sales_pitch = round(
                df_current_paper.loc[:, "Sales_Pitch"].mean(), 2)

            # Sum number of accepts
            num_accepts = df_current_paper[df_current_paper["Acceptance"] == "Accept"]
            num_accepts = len(num_accepts.index)

            # Sum number of rejects
            num_rejects = df_current_paper[df_current_paper["Acceptance"] == "Reject"]
            num_rejects = len(num_rejects.index)

            # Sum number of Discuss
            num_discuss = df_current_paper[df_current_paper["Acceptance"] == "Discuss"]
            num_discuss = len(num_discuss.index)

            # Number of best paper votes
            num_best_paper_votes = df_current_paper[df_current_paper["Best_Paper_Vote"] == "Yes"]
            num_best_paper_votes = len(num_best_paper_votes.index)

            # Grab comments for birddog
            list_comments_to_birddog = df_current_paper["Comments_for_Birddog"].tolist(
            )

            # Filter through list to make sure there are no empty junk values
            list_comments_to_birddog = [
                x for x in list_comments_to_birddog if str(x) != 'nan']

            # Grab comments to subcommittee
            list_comments_to_subcommittee = df_current_paper["Comments_for_Subcommittee"].tolist(
            )

            # Filter through list to make sure there are no empty junk values
            list_comments_to_subcommittee = [
                x for x in list_comments_to_subcommittee if str(x) != 'nan']

            # Add this record into the data frame
            df_new_entry = pd.DataFrame({"ID": unique_id,
                                         "Title": record_title, "Birddog": birddog,
                                         "Assigned_Subcommittee": assigned_subcommittee,
                                         "Mean_Substance_Rating": mean_substance,
                                         "Mean_Originality_Rating": mean_orig,
                                         "Mean_Sales_Pitch": mean_sales_pitch,
                                         "Mean_Style_Quality_Rating": mean_style_quality,
                                         "Num_Accept": num_accepts, "Num_Reject": num_rejects, "Num_Discuss": num_discuss,
                                         "Num_Best_Paper_Votes": num_best_paper_votes,
                                         "Comments_for_Birddog": [list_comments_to_birddog],
                                         "Comments_for_Subcommittee": [list_comments_to_subcommittee]}, index=[0])
            # Add the record
            df_reviews_summary = pd.concat(
                [df_reviews_summary, df_new_entry], axis=0)  # .reset_index()

        # Save our our file with the review summary
        df_reviews_summary.to_csv("Papers_PaperReviewSummary.csv")

    # Two factor cross tabulation of data
    def twoFactorCrossTab(self, df_papers: pd, firstColumnName: str, secondColumnName: str, fileName: str):
        ######################
        # df_papers:pd -> DataFrame containing all the paper submissions
        # firstColumnName:str -> String containing the name of the column we want to use for our first cross tab factor
        # secondColumnName:str -> String containing the name of the column we want to use for our second cross tab factor
        # fileName:str -> String containing the name of the file we want to save out
        ######################

        # Let's do a crosstab
        cross_tab = pd.crosstab(
            df_papers[firstColumnName], df_papers[secondColumnName])

        # Print out the cross tab file
        cross_tab.to_csv(fileName)
