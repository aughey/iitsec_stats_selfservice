# Created By: Anastacia "Stacy" MacAllister
# Created On: 03/14/2024 -> Happy Pie Day!!!!
# Description: This file contains functions to perform anlaysis for tutorial data coming from XCD

# Include the goodies we are going to need 
import pandas as pd
import numpy as np

# Define the class and it's methods
class TutorialAnalytics:

    # Define what it's constructor sets up
    def __init__(self):
        # Do something
        print("TutorialAnalytics::__init__ - Initalizing a TutorialAnalytics object")

    # Clean the data so it's usable -> TO DO: Add other data cleaning operations we want to do
    # TO DO: Move this and the PaperAnalytics function into a Util class
    def cleanData(self, df_tut:pd, standard_variables_list:list):
        ######################
        # df_tut:pd -> DataFrame containing all the paper submissions
        # standard_variables_list:list -> List (it's really a dictionary so need to change this) storing all the names that we want to change into standard ones
        ######################

        # Replace the column names spaces with underscores since XCD likes to oddly throw in spaces
        df_tut.columns = df_tut.columns.str.replace(' ', '_')

        # Rename the variables using our standard mapping here
        df_tut = df_tut.rename(columns = standard_variables_list)

        # Replace any XCD values with our standard mapping key here
        df_tut = df_tut.replace(standard_variables_list)
        
        # return the cleaned data with only the column names we care about
        return df_tut
    
    # Load in the file from xcd and return it
    def loadXCDFile(self, filePath:str, fileName:str):
        ##########################
        # filePath:str -> string containing the path to the file we want to load in 
        # fileName:str -> string containing the actual file name we want to load 
        # Note: Right now I'm being lazy and passing it in all as one. Need to change
        ##########################

        print("TutorialAnalytics::loadXCDFile - Loading file from XCD: ", str(filePath + fileName))

        # Load in the file and return it
        # TO DO: Add error handling for a non-existant file
        return pd.read_excel(filePath + fileName)
    
    # Group the submissions by coutnry
    def groupByCountry(self, df_tut:pd, firstColumnName:str, fileName:str):
        ######################
        # df_tut:pd -> DataFrame containing all the submissions
        # firstColumnName:str -> String that contains the column that we want to group by
        # fileName:str -> String containing the name of the file we want to save out
        ######################

        # Get only the quniqe
        df_unique_submisisons = df_tut.drop_duplicates(subset=["ID"])

        # Group the papers by the submitter category
        df_tut = df_unique_submisisons.groupby(firstColumnName).size()

        # Print out the file
        df_tut.to_csv(fileName)

    
    # Run analysis right after abstract review closes to get our submission demographics
    def postAbstractSubmissionClosureAnalytics(self, filePathToAbstractSubmissionFile:str, listOfColumnAliases:list):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################
        
        print("TutorialAnalytics::postAbstractSubmissionClosureAnalytics - Running the analysis for when abstract review closes.......")

        # Load in the excel file into a data frame so we can start working with it
        df_tut = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_tut = self.cleanData(df_tut, listOfColumnAliases)
        
        # Create the cross tabs by org
        self.groupByCountry(df_tut, "Origin_Country", "TUT_AbstractReview_Crosstabs_Country.csv")

    def postAbstractReviewAcceptanceAnalytics(self, filePathToAbstractSubmissionFile:str, listOfColumnAliases:list):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################
        
        print("TutorialAnalytics::postAbstractReviewAcceptanceAnalytics - Running the analysis for when abstract review closes.......")

        # Load in the excel file into a data frame so we can start working with it
        df_tut = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_tut = self.cleanData(df_tut, listOfColumnAliases)
        
        # Create the cross tabs by org
        self.twoFactorCrossTab(df_tut, "Org_Type", "Tutorial_Accept_Reject", "TUT_AbstractReview_AcceptReject.csv")

        # Let's do a crosstab by international and accept/reject to figure out how all the intenat'l paper faired
        cross_tab_international = pd.crosstab(df_tut["International(Y/N)"], df_tut["Tutorial_Accept_Reject"])

        # Print out the cross tab file
        cross_tab_international.to_csv("TUT_Accept_Reject_International.csv")

    def postPaperReviewAcceptanceAnalytics(self, filePath:str, listOfColumnAliases:list):
        ###############################
        # filePath:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################
        
        print("TutorialAnalytics::postPaperReviewAcceptanceAnalytics - Running the analysis for when paper review closes.......")

        # Load in the excel file into a data frame so we can start working with it
        df_tut = self.loadXCDFile(filePath, "")

        # Clean the data and standardize the delimiters so we can use
        df_tut = self.cleanData(df_tut, listOfColumnAliases)
        
        # Create the cross tabs by org
        self.twoFactorCrossTab(df_tut, "Org_Type", "Tutorial_Accept_Reject", "TUT_PaperReview_AcceptReject.csv")

        # Let's do a crosstab by international and accept/reject to figure out how all the intenat'l paper faired
        cross_tab_international = pd.crosstab(df_tut["International(Y/N)"], df_tut["Tutorial_Accept_Reject"])

        # Print out the cross tab file
        cross_tab_international.to_csv("TUT_Accept_Reject_International.csv")
        
        # Let's do a crosstab to see the accept/reject numbers by country
        cross_tab = pd.crosstab(df_tut["Origin_Country"], df_tut["Tutorial_Accept_Reject"])

        # Send this back so we can tabulate Papers, TUT, PDW accepts
        return cross_tab
 
    # Analyze the reviews for the subcommittee
    def preAbstractReviewAnalytics(self, filePathToAbstractSubmissionFile:str, listOfColumnAliases:dict):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("TutorialAnalytics::preAbstractReviewAnalytics - Running the analysis for pre abstract review.......")

        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_tut = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_tut = self.cleanData(df_tut, listOfColumnAliases)
        
        # Grab all the uniqe paper IDs and put them in an array
        tut_with_reviews = df_tut["ID"].unique()

        # Create a new data frame to store our results
        df_reviews_summary = pd.DataFrame(columns = ["ID", "Title", "Birddog_Volunteer", "International(Y/N)", "Past_Year_Tutorial_Number",
                                                    "Mean_Alignment", "Mean_Learning_Objectives", "Mean_Outline_Content",
                                                    "Num_Sales_Pitch","Num_Accept", "Num_Reject", "Num_Discuss", "Organization_Type", 
                                                    "Comments", "Biography"])
        
        # Cycle through all the unique IDs and populate the info
        for unique_id in tut_with_reviews:

            # Grab all the records for that ID
            df_current_record = df_tut.loc[df_tut["ID"] == unique_id]

            # Grab the title of the paper
            record_title = df_current_record["Title"].iloc[1]

            # Grab the list of birddog volunteers. This grabs all the records for a paper that someone responded yes to the birddog question
            birddog_volunteers_list = df_current_record[df_current_record["Birddog_Volunteer"] == "Yes"]
            
            # Combine the first and last name into a new column called "Combined_Name" so we can use it
            birddog_volunteers_list["Combined_Name"] = birddog_volunteers_list["ReviewerLastname"] + ',' + birddog_volunteers_list["ReviewerFirstname"]
            
            # Change the data from a dataframe to a list of strings without the index number
            birddog_volunteers_list = birddog_volunteers_list["Combined_Name"].to_string(index = False)

            # Figure out if it's an internatioal record
            bool_international = df_current_record["International(Y/N)"].iloc[1]

            # Figure out if they presented this in the past
            past_year_id = df_current_record["Past_Year_Tutorial_Number"].iloc[1]

            # Calculate the mean substance rating
            mean_align = round(df_current_record.loc[:, "Mean_Alignment"].mean(), 2)

            # Calculate the mean org rating
            mean_obj = round(df_current_record.loc[:, "Mean_Learning_Objectives"].mean(), 2)

            # Calculate the mean org rating
            mean_outline = round(df_current_record.loc[:, "Mean_Outline_Content"].mean(), 2)

            # Calculate sum of sales pitch vodes
            num_sales_pitch = df_current_record.loc[:, "Num_Sales_Pitch"].sum()

            # Sum number of accepts
            num_accepts = df_current_record[df_current_record["Acceptance"] == "Accept"]
            num_accepts = len(num_accepts.index)

            # Sum number of rejects
            num_rejects = df_current_record[df_current_record["Acceptance"] == "Reject"]
            num_rejects = len(num_rejects.index)

            # Sum number of Discuss
            num_discuss = df_current_record[df_current_record["Acceptance"] == "Discuss"]
            num_discuss = len(num_discuss.index)

            # Figure out Organization_Type
            org_type = df_current_record["Organization_Type"].iloc[1]
            
            # Grab comments
            list_comments = df_current_record["Comments"].tolist() 

            # Filter through list to make sure there are no empty junk values 
            list_comments = [x for x in list_comments if str(x) != 'nan']
            
            # Grab Bios
            list_bio = df_current_record ["Biography"].tolist() 

            # Filter through list to make sure there are no empty junk values 
            list_bio = [x for x in list_bio if str(x) != 'nan']
            

            # Add this record into the data frame
            df_new_entry = pd.DataFrame({"ID" : unique_id,
                                       "Title" : record_title, "Birddog_Volunteer" : [birddog_volunteers_list], 
                                       "International(Y/N)" : bool_international,
                                       "Past_Year_Tutorial_Number" : past_year_id,
                                       "Mean_Alignment" : mean_align,
                                       "Mean_Learning_Objectives" : mean_obj,
                                       "Mean_Outline_Content" : mean_outline, 
                                       "Num_Sales_Pitch" : num_sales_pitch,
                                       "Num_Accept" : num_accepts, "Num_Reject" : num_rejects, "Num_Discuss" : num_discuss, 
                                       "Organization_Type" : org_type,
                                       "Comments" : [list_comments], "Biography" : [list_bio]}, index = [0])
            # Add the record
            df_reviews_summary = pd.concat([df_reviews_summary, df_new_entry], axis = 0)#.reset_index()
            
        # Save our our file with the review summary
        df_reviews_summary.to_csv("TUT_AbstractReviewSummary.csv")

# Analyze the reviews for the subcommittee
    def prePaperReviewAnalytics(self, filePath:str, listOfColumnAliases:dict):
        ###############################
        # filePath:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("TutorialAnalytics::prePaperReviewAnalytics - Running the analysis for pre paper review.......")

        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_tut = self.loadXCDFile(filePath, "")

        # Clean the data and standardize the delimiters so we can use
        df_tut = self.cleanData(df_tut, listOfColumnAliases)
        
        # Grab all the uniqe paper IDs and put them in an array
        tut_with_reviews = df_tut["ID"].unique()

        # Create a new data frame to store our results
        df_reviews_summary = pd.DataFrame(columns = ["ID", "Title", "Birddog", "International(Y/N)", 
                                                    "Past_Year_Tutorial_Number",
                                                    "Content_Quantity_Right",
                                                    "Content_Quantity_Long",
                                                    "Content_Description",
                                                    "Slide_Quality", 
                                                    "Mean_Sales_Pitch",
                                                    "Num_Best_Tutorial",
                                                    "Num_Accept", 
                                                    "Num_Reject", 
                                                    "Num_Discuss", 
                                                    "Organization_Type", 
                                                    "Comments_to_Birddog", 
                                                    "Discussion_Comments",
                                                    "Biography"])
        
        # Cycle through all the unique IDs and populate the info
        for unique_id in tut_with_reviews:

            # Grab all the records for that ID
            df_current_record = df_tut.loc[df_tut["ID"] == unique_id]

            # Grab the title of the paper
            record_title = df_current_record["Title"].iloc[1]

            # Grab the birddog 
            birddog = df_current_record["Birddog"].iloc[1]
            
            # Figure out if it's an internatioal record
            bool_international = df_current_record["International(Y/N)"].iloc[1]

            # Figure out if they presented this in the past
            past_year_id = df_current_record["Past_Year_Tutorial_Number"].iloc[1]

            # Calculate how many right sized content votes we have
            num_content_quantity_right = df_current_record[df_current_record["Content_Quantity_Appropriate"] == "Seems Right"]
            num_content_quantity_right = len(num_content_quantity_right.index)

            # Calculate how many too long votes we have
            num_content_quantity_long = df_current_record[df_current_record["Content_Quantity_Appropriate"] == "Too Long"]
            num_content_quantity_long = len(num_content_quantity_long.index)
            
            # Calcuate mean of contnet quality score
            qual = list(filter(None, df_current_record.loc[:, "Content_Description"]))
            qual = pd.to_numeric(qual, errors="coerce")
            qual = qual[~np.isnan(qual)]
            mean_quality = round(qual.mean(), 2)

            # Calcualte the mean of slide quailty
            slide = list(filter(None, df_current_record.loc[:, "Slide_Quality"]))
            slide = pd.to_numeric(slide, errors="coerce")
            slide = slide[~np.isnan(slide)]
            slide_quality = round(slide.mean(), 2)

            # Calculate sum of sales pitch vodes
            sales = list(filter(None, df_current_record.loc[:, "Sales_Pitch"]))
            sales = pd.to_numeric(sales, errors="coerce")
            sales = sales[~np.isnan(sales)]
            mean_sales_pitch = round(sales.mean(), 2)
            
            # Sum number of accepts
            num_accepts = df_current_record[df_current_record["Acceptance"] == "Accept"]
            num_accepts = len(num_accepts.index)

            # Sum number of rejects
            num_rejects = df_current_record[df_current_record["Acceptance"] == "Reject"]
            num_rejects = len(num_rejects.index)

            # Sum number of Discuss
            num_discuss = df_current_record[df_current_record["Acceptance"] == "Discuss"]
            num_discuss = len(num_discuss.index)

            # Num best tutorial
            num_best_tut = df_current_record[df_current_record["Best_Tutorial"] == "Yes"]
            num_best_tut = len(num_best_tut.index)

            # Figure out Organization_Type
            org_type = df_current_record["Organization_Type"].iloc[1]
            
            # Grab comments for birddog
            birddog_list_comments = df_current_record["Comments_for_Birddog"].tolist() 

            # Filter through list to make sure there are no empty junk values 
            birddog_list_comments = [x for x in birddog_list_comments if str(x) != 'nan']

            # Grab comments for discussion
            discussion_list_comments = df_current_record["Comments_for_Discussion"].tolist()

            # Filter through list to make sure there are no empty junk values 
            discussion_list_comments = [x for x in discussion_list_comments if str(x) != 'nan']
            
            # Grab Bios
            list_bio = df_current_record ["Biography"].tolist() 

            # Filter through list to make sure there are no empty junk values 
            list_bio = [x for x in list_bio if str(x) != 'nan']
            
            # Add this record into the data frame
            df_new_entry = pd.DataFrame({"ID" : unique_id,
                                       "Title" : record_title, "Birddog" : birddog, 
                                       "International(Y/N)" : bool_international,
                                       "Past_Year_Tutorial_Number" : past_year_id,
                                       "Content_Quantity_Right" : num_content_quantity_right,
                                       "Content_Quantity_Long" : num_content_quantity_long,
                                       "Content_Description" : mean_quality,
                                       "Slide_Quality" : slide_quality, 
                                       "Mean_Sales_Pitch" : mean_sales_pitch,
                                       "Num_Accept" : num_accepts, 
                                       "Num_Reject" : num_rejects, 
                                       "Num_Discuss" : num_discuss, 
                                       "Num_Best_Tutorial" : num_best_tut,
                                       "Organization_Type" : org_type,
                                       "Comments_to_Birddog" : [birddog_list_comments], 
                                       "Discussion_Comments" : [discussion_list_comments],
                                       "Biography" : [list_bio]}, index = [0])
            # Add the record
            df_reviews_summary = pd.concat([df_reviews_summary, df_new_entry], axis = 0)#.reset_index()
            
        # Save our our file with the review summary
        df_reviews_summary.to_csv("TUT_PaperReviewSummary.csv")


    # Two factor cross tabulation of data
    def twoFactorCrossTab(self, df_records:pd, firstColumnName:str, secondColumnName:str, fileName:str):
        ######################
        # df_records:pd -> DataFrame containing all the record submissions
        # firstColumnName:str -> String containing the name of the column we want to use for our first cross tab factor
        # secondColumnName:str -> String containing the name of the column we want to use for our second cross tab factor
        # fileName:str -> String containing the name of the file we want to save out
        ######################
        
        # Let's do a crosstab
        cross_tab = pd.crosstab(df_records[firstColumnName], df_records[secondColumnName])

        # Print out the cross tab file
        cross_tab.to_csv(fileName)
            
