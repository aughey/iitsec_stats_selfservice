# Created By: Marty Bink
# Created On: 08/21/2024
# Description: This program cleans, formats, and analyzes Scholarship winners to track submissions

# Import all the external goodies we need for our analysis
import pandas as pd

class ScholarAnalytics:
	
	# Define what it's constructor sets up
	def __init__(self):
	# Do something
		print("ScholarAnalytics::__init__ - Starting Scholarship Analytics object")
	
	#Analytics function...the only function    
	def Analytics(self, path_to_papers:list, path_to_awardees:str, standard_variables_list:list):
		 	
		#Create the Awardee DataFrame
		#Load the file
		df_names = pd.read_excel(path_to_awardees)
	
		#Clean the data
		df_names.columns = df_names.columns.str.replace(' ', '_')
		
		#Create Output DF 
		df_Schol_submissions = pd.DataFrame(columns = ["Awardee Name", "Scholarship Name", "Scholarship Year", "Abstract Submitted?", "Submission Year", "Abstract ID", "Abstract Title", "Subcommittee", "First Author?", "Accepted?", "Paper Submitted?", "Paper Accepted?"])
			
		
		#Build the Paper Submissions DataFrame
		#Create Paper Submissions DF
		df_paperdata = pd.DataFrame(columns = ["ID", "Sub_Year", "SubK", "Title", "Ab_status", "Paper_status", "First_Name", "Last_Name"])
	
	
		#Load each Paper file, load data into DF, run the analyses, and add results to Output DF
		for filename in path_to_papers:	
			#Load file data into Data DF
			df_data = pd.read_excel(filename)

			#Clean the data
			#Remove pesky white space
			df_data.columns = df_data.columns.str.replace(' ', '_')
		
			#Replace column names with variable dictionary
			df_data = df_data.rename(columns = standard_variables_list)

     		# Replace any XCD values with our standard mapping key here
			df_data = df_data.replace(standard_variables_list)
		
			#Get data fields from file data (Data DF) and add into Paper Submissions DF
			#Create 'year' value
			fileIDvalue = str(df_data.loc[0 , "ID"]) 
			fileYear = ("20"+ fileIDvalue[:2]) 
			subYear = int(fileYear)
					
			#Iterate through Data DF/file putting data into Paper Submission DF
			i = int(0) #index counter for Data DF...know where we are in the dataframe
			for row in df_data["ID"]:
				#Create a temporay df (Current DF) to hold the data merge	
				df_current = pd.DataFrame({"ID" : int(row), "Sub_Year" : subYear, "SubK" : df_data["Subcommittee"], "Title" : df_data["Title"], "Ab_status" : df_data["Abstract_Accept"], "Paper_status" : df_data["Paper_Accept"], "First_Name" : df_data["First_Name"], "Last_Name" : df_data["Last_Name"]}, index = [i])
					
				df_paperdata = pd.concat([df_paperdata, df_current], axis = 0, ignore_index = True)
					 
				i += 1
		
		#Run the analysis
		#Get each awardee name and search submission DF
		a = int(0) #index counter for Awardee Names...Know which awardee we are using
		for awardee in df_names["Last_Name"]:
				
			#Initialize output variables. These are the default values and will load into the output if the awardee did not submit
			scholarship = df_names.loc[a , "Scholarship"]
			schol_year = df_names.loc[a , "Year"]
			firstName = df_names.loc[a , "First_Name"] 
			name = (firstName + " " + awardee)
			abstract = "No"
			subyear = ""
			id = ""
			title = ""
			subK = ""
			f_author = "No"
			ab_accept = "No"
			paper_submit = "No"
			paper_accept = "No"
				
			#Iterate through Paper Submission DF to find each instance of an awardee's name and then set variables as appropriate
			entry = int(0) #Counter to determine if awardee had a submission. This controls assignment of data if the is no submission 
			count = int(0) #Index counter for Paper Submissions DF...Know which row in Paper Submission DF we are using
			for x in df_paperdata["ID"]:
				#Compare current Awardee Name with author name in Paper Submission DF.  Assign data if a match.	
				if df_paperdata.loc[count , "Last_Name"] == awardee and df_paperdata.loc[count , "First_Name"] == firstName :
								
					abstract = "Yes"
					subyear = df_paperdata.loc[count , "Sub_Year"]
					id = x
					title = df_paperdata.loc[count , "Title"]
					subK = df_paperdata.loc[count , "SubK"]
					if df_paperdata.loc[count , "Ab_status"] == "Abstract_Accepted": ab_accept = "Yes"
					else: ab_accept = "No"
					if df_paperdata.loc[count , "Paper_status"] == "Paper_Accepted": 
						paper_submit = "Yes"
						paper_accept = "Yes"
					elif df_paperdata.loc[count , "Paper_status"] == "Paper_Rejected":
						paper_submit = "Yes"
						paper_accept = "No"
					else: paper_submit = "No"
					#First Author
					if x != df_paperdata.loc[count-1 , "ID"]: f_author = "Yes"
					else: f_author = "No"
					
					##Create a temporay df (Entry DF) to hold the variable assignments for Output	DF
					df_entry = pd.DataFrame({"Awardee Name" : name, "Scholarship Name" : scholarship, "Scholarship Year" : schol_year, "Abstract Submitted?" : abstract , "Submission Year" : subyear, "Abstract ID" : id , "Abstract Title" : title , "Subcommittee" : subK , "Accepted?" : ab_accept, "Paper Submitted?" : paper_submit, "Paper Accepted?" : paper_accept, "First Author?" : f_author}, index = [count])
				
					df_Schol_submissions = pd.concat([df_Schol_submissions, df_entry], axis = 0, ignore_index = True)
					
					entry += 1
				
				count += 1
			
			#Load default data into Output DF if awardee name was not in the Paper Submission DF 
			if entry < 1:
				df_entry = pd.DataFrame({"Awardee Name" : name, "Scholarship Name" : scholarship, "Scholarship Year" : schol_year, "Abstract Submitted?" : abstract , "Submission Year" : subyear, "Abstract ID" : id , "Abstract Title" : title , "Subcommittee" : subK , "Accepted?" : ab_accept, "Paper Submitted?" : paper_submit, "Paper Accepted?" : paper_accept, "First Author?" : f_author}, index = [count])
				
				df_Schol_submissions = pd.concat([df_Schol_submissions, df_entry], axis = 0, ignore_index = True)
								
			a += 1
			
						
		#Create Output file
		df_Schol_submissions.to_csv("ScholarshipsAwardeeSubmissions.csv")
		
		#Let us know when process is complete
		print ("\nScholarAnalytics::Analytics - Analysis Complete. Results written to ScholarshipsAwardeeSubmissions.csv")
