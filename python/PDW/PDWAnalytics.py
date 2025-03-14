# Created By: Anastacia "Stacy" MacAllister
# Created On: 03/15/2024 -> It's no longer pie day, sad day
# Description: This file contains functions to perform anlaysis for pdw data coming from XCD

# Include the goodies we are going to need
import pandas as pd

# Define the class and it's methods
class PDWAnalytics:

    # Define what it's constructor sets up
    def __init__(self):
        # Do something
        print("PDWAnalytics::__init__ - Initalizing a TutorialAnalytics object")

    # Clean the data so it's usable -> TO DO: Add other data cleaning operations we want to do
    # TO DO: Move this and the PaperAnalytics function into a Util class
    def cleanData(self, df_data:pd, standard_variables_list:list):
        ######################
        # df_data:pd -> DataFrame containing all the paper submissions
        # standard_variables_list:list -> List (it's really a dictionary so need to change this) 
            # storing all the names that we want to change into standard ones
        ######################
        
        # Replace the column names spaces with underscores since XCD likes to oddly throw in spaces
        df_data.columns = df_data.columns.str.replace(' ', '_')

        # Rename the variables using our standard mapping here
        df_data = df_data.rename(columns = standard_variables_list)

        # Replace any XCD values with our standard mapping key here
        df_data = df_data.replace(standard_variables_list)
        
        # return the cleaned data with only the column names we care about
        return df_data
    
    # Load in the file from xcd and return it
    def loadXCDFile(self, filePath:str, fileName:str):
        ##########################
        # filePath:str -> string containing the path to the file we want to load in 
        # fileName:str -> string containing the actual file name we want to load 
        # Note: Right now I'm being lazy and passing it in all as one. Need to change
        ##########################

        print("PDWAnalytics::loadXCDFile - Loading file from XCD: ", str(filePath + fileName))

        # Load in the file and return it
        # TO DO: Add error handling for a non-existant file
        return pd.read_excel(filePath + fileName)
    
    # Group the submissions by coutnry
    def groupByCountry(self, df_data:pd, firstColumnName:str, fileName:str):
        ######################
        # df_data:pd -> DataFrame containing all the submissions
        # firstColumnName:str -> String that contains the column that we want to group by
        # fileName:str -> String containing the name of the file we want to save out
        ######################

        # Get only the quniqe
        df_unique_submisisons = df_data.drop_duplicates(subset=["ID"])

        # Group the papers by the submitter category
        df_data = df_unique_submisisons.groupby(firstColumnName).size()

        # Print out the file
        df_data.to_csv(fileName)

    
    # Run analysis right after abstract review closes to get our submission demographics
    def postAbstractSubmissionClosureAnalytics(self, filePathToAbstractSubmissionFile:str, 
                                               listOfColumnAliases:list):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################
        
        print("PDWAnalytics::postAbstractSubmissionClosureAnalytics - Running the analysis for when abstract review closes.......")

        # Load in the excel file into a data frame so we can start working with it
        df_pdw = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_pdw = self.cleanData(df_pdw, listOfColumnAliases)
        
        # Create the cross tabs by org
        self.groupByCountry(df_pdw, "Origin_Country", "PDW_AbstractReview_Crosstabs_Country.csv")
        
   ####MLB Code    
    # Analyze the reviews for the subcommittee
    def preAbstractReviewAnalytics(self, filePathToAbstractSubmissionFile:str, listOfColumnAliases:dict):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("PDWAnalytics::preAbstractReviewAnalytics - Running the analysis for pre abstract review.......")
        
        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_pdw = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_pdw = self.cleanData(df_pdw, listOfColumnAliases)

        print(df_pdw.columns)
        
        # Grab all the uniqe paper IDs and put them in an array
        pdw_with_reviews = df_pdw["ID"].unique()
        
        # Create a new data frame to store our results
        df_reviews_summary = pd.DataFrame(columns = ["ID", "Title", "Num_Accept", "Num_Reject", "Num_Discuss", "Comments", "Biography" , "Room_Type"])
        
        # Cycle through all the unique IDs and populate the info
        for unique_id in pdw_with_reviews:

            # Grab all the records for that ID
            df_current_record = df_pdw.loc[df_pdw["ID"] == unique_id]

            # Grab the title of the paper
            record_title = df_current_record["Title"].iloc[0]

            # Sum number of accepts
            num_accepts = df_current_record[df_current_record["Acceptance"] == 1]
            num_accepts = len(num_accepts.index)

            # Sum number of rejects
            num_rejects = df_current_record[df_current_record["Acceptance"] == 2]
            num_rejects = len(num_rejects.index)

            # Sum number of Discuss
            num_discuss = df_current_record[df_current_record["Acceptance"] == 3]
            num_discuss = len(num_discuss.index)
            
            # Grab comments
            list_comments = df_current_record["Comments"].tolist() 

            # Filter through list to make sure there are no empty junk values 
            list_comments = [x for x in list_comments if str(x) != 'nan']
            
            # Add author bio to record
            list_bio = df_current_record["Biography"].tolist()
            
            # Filter bios to make sure there are no empty junk values
            list_bio = [x for x in list_bio if str(x) != 'nan']
            
            # Add Type of Room Set-up needed
            room_type = df_current_record["Room_Type"]
            
            # Add this record into the data frame
            df_new_entry = pd.DataFrame({"ID" : unique_id,
                                       "Title" : record_title, 
                                       "Num_Accept" : num_accepts, "Num_Reject" : num_rejects, "Num_Discuss" : num_discuss, 
                                       "Comments" : [list_comments], "Biography" : [list_bio], "Room_Type" : room_type}, index = [0])
            
            # Add the record
            df_reviews_summary = pd.concat([df_reviews_summary, df_new_entry], axis = 0)#.reset_index()
            
        # Save our our file with the review summary
        df_reviews_summary.to_csv("PDW_AbstractReviewSummary.csv")
 
 ##Resume Stacy's code

# Analyze the reviews for the subcommittee
    def prePaperReviewAnalytics(self, filePath:str, listOfColumnAliases:dict):
        ###############################
        # filePath:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################

        print("PDWAnalytics::prePaperReviewAnalytics - Running the analysis for pre paper review.......")
        
        # Load in the excel file into a data frame so we can start working with it
        # TO DO: Figure ouw how I want to deal with file name vs file path
        df_pdw = self.loadXCDFile(filePath, "")

        # Clean the data and standardize the delimiters so we can use
        df_pdw = self.cleanData(df_pdw, listOfColumnAliases)

        print(df_pdw.columns)
        
        # Grab all the uniqe paper IDs and put them in an array
        pdw_with_reviews = df_pdw["ID"].unique()
        
        # Create a new data frame to store our results
        df_reviews_summary = pd.DataFrame(columns = ["ID", "Title", "Num_Accept", "Num_Reject", "Num_Discuss", "Comments", "Biography" , "Room_Type"])
        
        # Cycle through all the unique IDs and populate the info
        for unique_id in pdw_with_reviews:

            # Grab all the records for that ID
            df_current_record = df_pdw.loc[df_pdw["ID"] == unique_id]

            # Grab the title of the paper
            record_title = df_current_record["Title"].iloc[0]

            # Sum number of accepts
            num_accepts = df_current_record[df_current_record["Acceptance"] == 1]
            num_accepts = len(num_accepts.index)

            # Sum number of rejects
            num_rejects = df_current_record[df_current_record["Acceptance"] == 2]
            num_rejects = len(num_rejects.index)

            # Sum number of Discuss
            num_discuss = df_current_record[df_current_record["Acceptance"] == 3]
            num_discuss = len(num_discuss.index)
            
            # Grab comments
            list_comments = df_current_record["Comments"].tolist() 

            # Filter through list to make sure there are no empty junk values 
            list_comments = [x for x in list_comments if str(x) != 'nan']
            
            # Add author bio to record
            list_bio = df_current_record["Biography"].tolist()
            
            # Filter bios to make sure there are no empty junk values
            list_bio = [x for x in list_bio if str(x) != 'nan']
            
            # Add Type of Room Set-up needed
            room_type = df_current_record["Room_Type"]
            
            # Add this record into the data frame
            df_new_entry = pd.DataFrame({"ID" : unique_id,
                                       "Title" : record_title, 
                                       "Num_Accept" : num_accepts, "Num_Reject" : num_rejects, "Num_Discuss" : num_discuss, 
                                       "Comments" : [list_comments], "Biography" : [list_bio], "Room_Type" : room_type}, index = [0])
            
            # Add the record
            df_reviews_summary = pd.concat([df_reviews_summary, df_new_entry], axis = 0)#.reset_index()
            
        # Save our our file with the review summary
        df_reviews_summary.to_csv("PDW_PaperReviewSummary.csv")
 

    def postAbstractReviewAcceptanceAnalytics(self, filePathToAbstractSubmissionFile:str, listOfColumnAliases:list):
        ###############################
        # filePathToAbstractSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################
        
        print("TutorialAnalytics::postAbstractReviewAcceptanceAnalytics - Running the analysis for when abstract review closes.......")

        # Load in the excel file into a data frame so we can start working with it
        df_record = self.loadXCDFile(filePathToAbstractSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_record = self.cleanData(df_record, listOfColumnAliases)
        
        # Create the cross tabs by org
        #self.twoFactorCrossTab(df_record, "Org_Type", "Tutorial_Accept_Reject", "PDW_AbstractReview_AcceptReject.csv")

        # Let's do a crosstab by international and accept/reject to figure out how all the intenat'l paper faired
        cross_tab_international = pd.crosstab(df_record["International(Y/N)"], df_record["PDW_Accept_Reject"])

        # Print out the cross tab file
        cross_tab_international.to_csv("PDW_Accept_Reject_International.csv")

    # Run the post paper review analytics
    def postPaperReviewAcceptanceAnalytics(self, filePathToSubmissionFile:str, listOfColumnAliases:list):
        ###############################
        # filePathToSubmissionFile:str -> String containing the file path and name to the file we want to load
        # listOfColumnAliases:dict -> Dictionary contianing the mapping from crazy XCD names to our better names
        ##############################
        
        print("TutorialAnalytics::postPaperReviewAcceptanceAnalytics - Running the analysis for when paper review is done.......")

        # Load in the excel file into a data frame so we can start working with it
        df_record = self.loadXCDFile(filePathToSubmissionFile, "")

        # Clean the data and standardize the delimiters so we can use
        df_record = self.cleanData(df_record, listOfColumnAliases)
        
        # Let's do a crosstab to see the accept/reject numbers by country
        cross_tab = pd.crosstab(df_record["Origin_Country"], df_record["PDW_Accept_Reject"])

        # Send this back so we can tabulate Papers, TUT, PDW accepts
        return cross_tab

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
