# Created By: Anastacia "Stacy" MacAllister
# Created On: 03/09/2024
# Description: This program cleans, formats, and analyzes I/ITSEC data

# Import all the external goodies we need for our analysis
import pandas as pd

# Import out custom defined classes
import Papers.PaperAnalytics as PaperAnalytics
import TUT.TutorialAnalytics as TutorialAnalytics
import PDW.PDWAnalytics as PDWAnalytics
import Scholarships.ScholarAnalytics as ScholarAnalytics

# Define and entry point for the program and start letting the user choose their own adventrue
column_mappings = {'_Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_US?_': 'International(Y/N)',
                   'Primary_Contact_-_Country': 'Origin_Country',
                   'Education': 'ED',
                   'Training': 'TR',
                   'Simulation': 'SIM',
                   'Initial Acceptance at Abstract Stage': 'Abstract_Accepted',
                   'Initial Rejection at Abstract Stage': 'Abstract_Rejected',
                   'Human Performance Analysis and Engineering': 'HPAE',
                   'Emerging Concepts and Innovative Technologies': 'ECIT',
                   'Policy, Standards, Management, and Acquisition': 'PSMA',
                   'Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?': 'International(Y/N)',
                   'Rejection of Tutorial Proposal': 'Proposal_Rejected',
                   'Provisional Acceptance of Tutorial Proposal': 'Proposal_Accepted',
                   'Final Acceptance at Paper Review ': 'Paper_Accepted',
                   'Final_Acceptance_at_Paper_Review': 'Paper_Accepted',
                   'Final_Acceptance_at_Paper_Review_': 'Paper_Accepted',
                   'Final Rejection at Paper Review ': 'Paper_Rejected',
                   'Final Rejection at Paper Review': 'Paper_Rejected',
                   'Final_Rejection_at_Paper_Review_': 'Paper_Rejected',
                   'Final_Rejection_at_Paper_Review': 'Paper_Rejected',
                   '2023_Best_Paper_Nominee': 'Paper_Accepted',
                   '2023 Best Paper Nominee': 'Paper_Accepted',
                   'Final Rejection of Tutorial': 'TUT_Rejected',
                   'Final_Acceptance_of_Tutorial': 'TUT_Accepted',
                   'Final Acceptance of Tutorial': 'TUT_Accepted',
                   'Final Accept': 'PDW_Accepted',
                   'Final_Accept': 'PDW_Accepted',
                   'Final Reject': 'PDW_Rejected',
                   'Final_Reject': 'PDW_Rejected',
                   'Would_you_want_to_Birddog_this_Abstract_to_Paper?': 'Birddog_Volunteer',
                   'Comments_for_Birddog_(for_author_feedback)': 'Comments_for_Birddog',
                   'Comments_for_the_Subcommittee_(reviewers)': 'Comments_for_Subcommittee',
                   'Are_you_interested_in_being_the_Birddog?': 'Birddog_Volunteer',
                   'Please_provide_your_2023_tutorial_number_for_reference_(if_presented_in_2023)._If_you_presented_this_topic_at_other_conference_please_list_conference_date_location_and_if_published.': 'Past_Year_Tutorial_Number',
                   'Alignment:_How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?': 'Mean_Alignment',
                   'Alignment:__How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?': 'Mean_Alignment',
                   'Learning_Objectives:_How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?': 'Mean_Learning_Objectives',
                   'Learning_Objectives:__How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?': 'Mean_Learning_Objectives',
                   'Outline_&_Content_Description:_Is_the_tutorial_content_appropriate_and_is_it_clearly_described?': 'Mean_Outline_Content',
                   'Outline_&_Content_Description:__Is_the_tutorial_content_appropriate_and_is_it_clearly_described?': 'Mean_Outline_Content',
                   'Does_this_tutorial_proposal_appear_to_include_a_sales_pitch?': 'Num_Sales_Pitch',
                   'Comments': 'Comments',
                   'Comments/Remarks': 'Comments',
                   'Desired_Room_Setup': 'Room_Type',
                   'AbTitle': 'Title',
                   'Reviewer_Comments': 'Comments',
                   'Originality': 'Originality_Rating',
                   'Style_/_Writing_Quality': 'Quality_Rating',
                   'Birddog': 'Birddog',
                   'Is_this_paper_a_Best_Paper_Candidate?': 'Best_Paper_Vote',
                   'Comments_for_the_Subcommittee': 'Comments_for_Subcommittee',
                   'Content_Description:_How_clear_is_the_tutorial_content_in_the_slides_and_any_author-provided_notes?': 'Content_Description',
                   'Is_the_amount_of_content_appropriate_for_90_minutes?': 'Content_Quantity_Appropriate',
                   'Are_the_slides_visually_clear_(readability_organization)?': 'Slide_Quality',
                   'Sales_Pitch?': 'Sales_Pitch',
                   'Best_Tutorial_nomination?': 'Best_Tutorial',
                   'Comments_for_Birddog': 'Comments_for_Birddog',
                   'Comments_for_discussion': 'Comments_for_Discussion',
                   'Subcommittee_Category': 'Subcommittee',
                   'Final Acceptance at Paper Stage': 'Paper_Accepted',
                   'Final Rejection at Paper Stage': 'Paper_Rejected',
                   'IITSEC Paper Approved': 'Paper_Accepted',
                   'Best Paper Winner': 'Paper_Accepted',
                   'I/ITSEC 2021 BP Paper Approved': 'Paper_Accepted',
                   'Review_Status': 'Accept_Reject',
                   'Paper Review Status': 'Accept_Reject',
                   'Paper_Review_Status': 'Accept_Reject',
                   'How_would_you_label_your_submission?': 'Org_Type',
                   'Initial Acceptance of Professional Development Workshop': 'Proposal_Accepted',
                   'Initial Rejection of Professional Development Workshop': 'Proposal_Rejected',
                   'Initial Rejection of Professional Dev Workshop': 'Proposal_Rejected',
                   'Main_Subcommittee_Category': 'Assigned_Subcommittee'}


def main():
    """
    Starts the program by providing user with options menu.

    Args:
        None

    Returns:
        None
    """

    # Print out a welcome message to the user
    print("Hello and welcome to the I/ITSEC KM data analysis program. Please select which report stage to run to continue........")

    # Print out the analytics options for the user to select
    print("1. Post Abstract Submission Closure \n"
          "2. Pre Abstract Review \n"
          "3. Post Abstract Review Acceptance Numbers \n"
          "4. Pre Paper Review \n"
          "5. Post Paper Review Acceptance Numbers\n"
          "6. Post Conference Attendance Metrics\n"
          "7. Scholarship Analysis")

    # Prompt for choice
    print("Input integer choice and hit enter: ")
    analysis_choice = int(input())

    # Run analysis based on the choice they input
    if analysis_choice == int(1):

        print("You selected post abstract submission closure analysis. Starting analysis......")
        post_abstract_submission_closure()
    elif analysis_choice == int(2):
        print("You selcted pre abstract review analysis. Starting the report......")
        pre_absract_review()
    elif analysis_choice == int(3):
        print("You selcted post abstract review analysis. Starting the report......")
        post_abstract_review_acceptance_numbers()
    elif analysis_choice == int(4):
        print("You selcted pre paper review analysis. Starting the report......")
        pre_paper_review_acceptance_numbers()
    elif analysis_choice == int(5):
        print("You selcted post paper review analysis. Starting the report......")
        post_paper_review_acceptance_numbers()
    elif analysis_choice == int(7):
        print("You selcted scholarship analysis. Starting the report......")
        scholarship_analysis()
    else:
        print("Error: Analysis type is not supported. Please try again. Selected type: ", analysis_choice)
        exit()

# Function to run post abstract review accept/reject numbers


def post_abstract_review_acceptance_numbers():
    """
    Function runs post abstract review accept/reject numbers.

    Args:
        None

    Returns:
        None
    """

    # TO DO: Move these variables out from this function and into a config file

    # Analyze the papers
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_papers = {"Main_Subcommittee_Category": "Assigned_Subcommittee",
                                      "_Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_US?_": "International(Y/N)",
                                      "Primary_Contact_-_Country": "Origin_Country",
                                      "How_would_you_label_your_submission?": "Org_Type",
                                      "Review_Status": "Abstract_Accept_Reject",
                                      "Education": "ED", "Training": "TR",
                                      "Simulation": "SIM",
                                      "Initial Acceptance at Abstract Stage": "Abstract_Accepted",
                                      "Initial Rejection at Abstract Stage": "Abstract_Rejected",
                                      "Human Performance Analysis and Engineering": "HPAE",
                                      "Emerging Concepts and Innovative Technologies": "ECIT",
                                      "Policy, Standards, Management, and Acquisition": "PSMA"}

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_papers = "../Data/paper_final_rev.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    PaperAnalytics.PaperAnalytics().postAbstractReviewAcceptanceAnalytics(
        path_to_papers, standard_variables_list_papers)

    # Analyze the tutorials
    # This variable maps all the XCD madness into some standard variable names that we can use
    standard_variables_list_tut = {"Primary_Contact_-_Country": "Origin_Country",
                                   "How_would_you_label_your_submission?": "Org_Type",
                                   "Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?": "International(Y/N)",
                                   "Review_Status": "Tutorial_Accept_Reject",
                                   "Rejection of Tutorial Proposal": "Proposal_Rejected",
                                   "Provisional Acceptance of Tutorial Proposal": "Proposal_Accepted"}

    # This variable points to where the program can find the tut submission file downloaded from XCD
    path_to_tut = "../Data/tut_final_rev.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the TUTAnalytics object to do the number crunching magic
    TutorialAnalytics.TutorialAnalytics().postAbstractReviewAcceptanceAnalytics(
        path_to_tut, standard_variables_list_tut)

    # No need for PDW right now. It does not have the fields to support the traditional data anlaysis
    """# Analyze the PDWs
    # This variable maps all the XCD madness into some standard variable names that we can use
    standard_variables_list_pdw = {"Primary_Contact_-_Country":"Origin_Country",
                                   "How_would_you_label_your_submission?" : "Org_Type",
                                   "Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?":"International(Y/N)",
                                   "Review_Status": "Tutorial_Accept_Reject",
                                   "Initial Rejection of Professional Dev Workshop" : "Proposal_Rejected",
                                   "Initial Acceptance of Professional Development Workshop" : "Proposal_Accepted"}

    # This variable points to where the program can find the pdw submission file downloaded from XCD 
    path_to_pdw = "../Data/pdw_post_rev.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PDWAnalytics object to do the number crunching magic
    PDWAnalytics.PDWAnalytics().postAbstractReviewAcceptanceAnalytics(path_to_pdw, standard_variables_list_pdw)
    """

# Function to run post paper review accept/reject numbers


def post_paper_review_acceptance_numbers():
    """
    Function runs post paper review accept/reject numbers.

    Args:
        None

    Returns:
        None
    """
    # TO DO: Move these variables out from this function and into a config file

    # Analyze the papers
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_papers = {"Main_Subcommittee_Category": "Assigned_Subcommittee",
                                      "_Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_US?_": "International(Y/N)",
                                      "Primary_Contact_-_Country": "Origin_Country",
                                      "Country": "Origin_Country",
                                      "How_would_you_label_your_submission?": "Org_Type",
                                      "Paper_Review_Status": "Paper_Accept_Reject",
                                      "Education": "ED", "Training": "TR",
                                      "Simulation": "SIM",
                                      "Final Acceptance at Paper Review ": "Paper_Accepted",
                                      "Final_Acceptance_at_Paper_Review": "Paper_Accepted",
                                      "Final_Acceptance_at_Paper_Review_": "Paper_Accepted",
                                      "Final Rejection at Paper Review ": "Paper_Rejected",
                                      "Final Rejection at Paper Review": "Paper_Rejected",
                                      "Final_Rejection_at_Paper_Review_": "Paper_Rejected",
                                      "Final_Rejection_at_Paper_Review": "Paper_Rejected",
                                      "Human Performance Analysis and Engineering": "HPAE",
                                      "Emerging Concepts and Innovative Technologies": "ECIT",
                                      "Policy, Standards, Management, and Acquisition": "PSMA",
                                      "2023_Best_Paper_Nominee": "Paper_Accepted",
                                      "2023 Best Paper Nominee": "Paper_Accepted"}

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_papers = "Data/2024_paper_Review_all_done.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    df_final_paper_numbers_summary = PaperAnalytics.PaperAnalytics(
    ).postPaperReviewAcceptanceAnalytics(path_to_papers, standard_variables_list_papers)

    return

    # Analyze the tutorials
    # This variable maps all the XCD madness into some standard variable names that we can use
    standard_variables_list_tut = {"Primary_Contact_-_Country": "Origin_Country",
                                   "How_would_you_label_your_submission?": "Org_Type",
                                   "Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?": "International(Y/N)",
                                   "Paper_Review_Status": "Tutorial_Accept_Reject",
                                   "Paper Review Status": "Tutorial_Accept_Reject",
                                   "Final Rejection of Tutorial": "TUT_Rejected",
                                   "Final_Acceptance_of_Tutorial": "TUT_Accepted",
                                   "Final Acceptance of Tutorial": "TUT_Accepted"}

    # This variable points to where the program can find the tut submission file downloaded from XCD
    path_to_tut = "../Data/TUT_done.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the TUTAnalytics object to do the number crunching magic
    df_final_tutorial_numbers_summary = TutorialAnalytics.TutorialAnalytics(
    ).postPaperReviewAcceptanceAnalytics(path_to_tut, standard_variables_list_tut)

    # No need for PDW right now. It does not have the fields to support the traditional data anlaysis
    # Analyze the PDWs
    # This variable maps all the XCD madness into some standard variable names that we can use
    standard_variables_list_pdw = {"Primary_Contact_-_Country": "Origin_Country",
                                   "How_would_you_label_your_submission?": "Org_Type",
                                   "Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?": "International(Y/N)",
                                   "Paper Review Status": "PDW_Accept_Reject",
                                   "Paper_Review_Status": "PDW_Accept_Reject",
                                   "Initial Rejection of Professional Dev Workshop": "Proposal_Rejected",
                                   "Initial Acceptance of Professional Development Workshop": "Proposal_Accepted",
                                   "Final Accept": "PDW_Accepted",
                                   "Final_Accept": "PDW_Accepted",
                                   "Final Reject": "PDW_Rejected",
                                   "Final_Reject": "PDW_Rejected"}

    # This variable points to where the program can find the pdw submission file downloaded from XCD
    path_to_pdw = "../Data/PDW_Final_Acceptance_Numbers.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PDWAnalytics object to do the number crunching magic
    df_final_PDW_numbers_summary = PDWAnalytics.PDWAnalytics(
    ).postPaperReviewAcceptanceAnalytics(path_to_pdw, standard_variables_list_pdw)

    # Put all the dataframes together
    combined = pd.concat([df_final_paper_numbers_summary,
                         df_final_tutorial_numbers_summary, df_final_PDW_numbers_summary], axis=1)
    combined = combined.fillna(0)

    # Sum the accepted
    combined["Total_Accepted"] = combined["Paper_Accepted"] + \
        combined["TUT_Accepted"] + combined["PDW_Accepted"]
    combined["Accept_Percentage"] = combined["Total_Accepted"] / \
        combined["Total_Accepted"].sum()
    combined["Accept_Percentage"] = combined["Accept_Percentage"].round(2)
    combined["Total_Rejected"] = combined["Paper_Rejected"] + \
        combined["TUT_Rejected"]  # + combined["PDW_Rejected"]

    # Remove the intermediate columns
    combined = combined.drop(
        ["Paper_Accepted", "Paper_Rejected", "TUT_Rejected"], axis=1)
    combined.to_csv("Total_Accepts_By_Country.csv")

# Function to specify how we run pre abstract analytics


def post_abstract_submission_closure():
    """
    Function to specify how we run pre abstract analytics.

    Args:
        None

    Returns:
        None
    """

    # TO DO: Move these variables out from this function and into a config file

    # Analyze the papers
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_papers = {"Main_Subcommittee_Category": "Assigned_Subcommittee",
                                      "_Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_US?_": "International(Y/N)",
                                      "Primary_Contact_-_Country": "Origin_Country",
                                      "How_would_you_label_your_submission?": "Org_Type",
                                      "Education": "ED",
                                      "Training": "TR",
                                      "Simulation": "SIM",
                                      "Human Performance Analysis and Engineering": "HPAE",
                                      "Emerging Concepts and Innovative Technologies": "ECIT",
                                      "Policy, Standards, Management, and Acquisition": "PSMA"}

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_papers = "../Data/papers_post_transfer.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    PaperAnalytics.PaperAnalytics().postAbstractSubmissionClosureAnalytics(
        path_to_papers, standard_variables_list_papers)

    # Analyze the tutorials
    # This variable maps all the XCD madness into some standard variable names that we can use
    standard_variables_list_tut = {
        "Primary_Contact_-_Country": "Origin_Country"}

    # This variable points to where the program can find the tut submission file downloaded from XCD
    path_to_tut = "../Data/tut.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the TUTAnalytics object to do the number crunching magic
    TutorialAnalytics.TutorialAnalytics().postAbstractSubmissionClosureAnalytics(
        path_to_tut, standard_variables_list_tut)

    # Analyze the PDWs
    # This variable maps all the XCD madness into some standard variable names that we can use
    standard_variables_list_pdw = {
        "Primary_Contact_-_Country": "Origin_Country"}

    # This variable points to where the program can find the pdw submission file downloaded from XCD
    path_to_pdw = "../Data/pdw.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PDWAnalytics object to do the number crunching magic
    PDWAnalytics.PDWAnalytics().postAbstractSubmissionClosureAnalytics(
        path_to_pdw, standard_variables_list_pdw)

# Run the preabstract review anaysis to give the chairs their reports


def pre_absract_review():
    """
    Run preabstract review anaysis for chair's reports.

    Args:
        None

    Returns:
        None
    """

    # Analyze the papers
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_papers = {"Main_Subcommittee_Category": "Assigned_Subcommittee",
                                      "_Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_US?_": "International(Y/N)",
                                      "Primary_Contact_-_Country": "Origin_Country",
                                      "How_would_you_label_your_submission?": "Org_Type",
                                      "Education": "ED",
                                      "Training": "TR",
                                      "Simulation": "SIM",
                                      "Human Performance Analysis and Engineering": "HPAE",
                                      "Emerging Concepts and Innovative Technologies": "ECIT",
                                      "Policy, Standards, Management, and Acquisition": "PSMA",
                                      "Would_you_want_to_Birddog_this_Abstract_to_Paper?": "Birddog_Volunteer",
                                      "Comments_for_Birddog_(for_author_feedback)": "Comments_for_Birddog",
                                      "Comments_for_the_Subcommittee_(reviewers)": "Comments_for_Subcommittee"}

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_papers = "../Data/papers_review_iitsec_102934.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    PaperAnalytics.PaperAnalytics().preAbstractReviewAnalytics(
        path_to_papers, standard_variables_list_papers)

    # Analyze the tutorials
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_tut = {"Are_you_interested_in_being_the_Birddog?": "Birddog_Volunteer",
                                   "Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?": "International(Y/N)",
                                   "Please_provide_your_2023_tutorial_number_for_reference_(if_presented_in_2023)._If_you_presented_this_topic_at_other_conference_please_list_conference_date_location_and_if_published.": "Past_Year_Tutorial_Number",
                                   "Alignment:_How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?": "Mean_Alignment",
                                   "Alignment:__How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?": "Mean_Alignment",
                                   "Learning_Objectives:_How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?": "Mean_Learning_Objectives",
                                   "Learning_Objectives:__How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?": "Mean_Learning_Objectives",
                                   "Outline_&_Content_Description:_Is_the_tutorial_content_appropriate_and_is_it_clearly_described?": "Mean_Outline_Content",
                                   "Outline_&_Content_Description:__Is_the_tutorial_content_appropriate_and_is_it_clearly_described?": "Mean_Outline_Content",
                                   "Does_this_tutorial_proposal_appear_to_include_a_sales_pitch?": "Num_Sales_Pitch",
                                   "How_would_you_label_your_submission?": "Organization_Type",
                                   "Comments": "Comments"}

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_tut = "../Data/tut_review_iitsec_102725.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    TutorialAnalytics.TutorialAnalytics().preAbstractReviewAnalytics(
        path_to_tut, standard_variables_list_tut)

    # Analyze PDWs
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_pdw = {"Comments/Remarks": "Comments",
                                   "Desired_Room_Setup": "Room_Type",
                                   "AbTitle": "Title",
                                   "Review_Status": "Acceptance",
                                   "Reviewer_Comments": "Comments",
                                   "Initial Acceptance of Professional Development Workshop": "Accept",
                                   "Initial Rejection of Professional Dev Workshop": "Reject"
                                   }

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_pdw = "../Data/PDW_review_iitsec_063607.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    PDWAnalytics.PDWAnalytics().preAbstractReviewAnalytics(
        path_to_pdw, standard_variables_list_pdw)

# Run the pre paper review analysis to give the chairs their reports


def pre_paper_review_acceptance_numbers():
    """
    Run prepaper review anaysis for chair's reports.

    Args:
        None

    Returns:
        None
    """
    # Analyze the papers
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_papers = {"Main_Subcommittee_Category": "Assigned_Subcommittee",
                                      "_Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_US?_": "International(Y/N)",
                                      "Primary_Contact_-_Country": "Origin_Country",
                                      "How_would_you_label_your_submission?": "Org_Type",
                                      "Originality": "Originality_Rating",
                                      "Style_/_Writing_Quality": "Quality_Rating",
                                      "Education": "ED",
                                      "Training": "TR",
                                      "Simulation": "SIM",
                                      "Human Performance Analysis and Engineering": "HPAE",
                                      "Emerging Concepts and Innovative Technologies": "ECIT",
                                      "Policy, Standards, Management, and Acquisition": "PSMA",
                                      "Birddog": "Birddog",
                                      "Comments_for_Birddog_(for_author_feedback)": "Comments_for_Birddog",
                                      "Is_this_paper_a_Best_Paper_Candidate?": "Best_Paper_Vote",
                                      "Comments_for_the_Subcommittee_(reviewers)": "Comments_for_Subcommittee",
                                      "Comments_for_the_Subcommittee": "Comments_for_Subcommittee"}

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_papers = "../Data/paper_review_iitsec_2024.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    PaperAnalytics.PaperAnalytics().prePaperReviewAnalytics(
        path_to_papers, standard_variables_list_papers)

    # Analyze the tutorials
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_tut = {"Birddog": "Birddog",
                                   "Does_the_primary_or_secondary_author_(first_second_or_both)_reside_outside_the_USA?": "International(Y/N)",
                                   "Please_provide_your_2023_tutorial_number_for_reference_(if_presented_in_2023)._If_you_presented_this_topic_at_other_conference_please_list_conference_date_location_and_if_published.": "Past_Year_Tutorial_Number",
                                   "Alignment:_How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?": "Mean_Alignment",
                                   "Alignment:__How_well_does_the_tutorial_align_with_the_purposes_of_the_tutorial_program?": "Mean_Alignment",
                                   "Learning_Objectives:_How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?": "Mean_Learning_Objectives",
                                   "Learning_Objectives:__How_clearly_does_the_author_describe_what_participants_will_learn_in_the_tutorial?": "Mean_Learning_Objectives",
                                   "Outline_&_Content_Description:_Is_the_tutorial_content_appropriate_and_is_it_clearly_described?": "Mean_Outline_Content",
                                   "Outline_&_Content_Description:__Is_the_tutorial_content_appropriate_and_is_it_clearly_described?": "Mean_Outline_Content",
                                   "Content_Description:_How_clear_is_the_tutorial_content_in_the_slides_and_any_author-provided_notes?": "Content_Description",
                                   "Is_the_amount_of_content_appropriate_for_90_minutes?": "Content_Quantity_Appropriate",
                                   "Are_the_slides_visually_clear_(readability_organization)?": "Slide_Quality",
                                   "Sales_Pitch?": "Sales_Pitch",
                                   "Best_Tutorial_nomination?": "Best_Tutorial",
                                   "Comments_for_Birddog": "Comments_for_Birddog",
                                   "Comments_for_discussion": "Comments_for_Discussion",
                                   "How_would_you_label_your_submission?": "Organization_Type",
                                   "Comments": "Comments"}

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_tut = "../Data/tut_review_iitsec_2024.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    TutorialAnalytics.TutorialAnalytics().prePaperReviewAnalytics(
        path_to_tut, standard_variables_list_tut)

    # Analyze PDWs
    # This variable maps all the XCD madness into some standard variable names that we can use. Format -> "XCD_Name":"New_Name"
    standard_variables_list_pdw = {"Comments/Remarks": "Comments",
                                   "Desired_Room_Setup": "Room_Type",
                                   "AbTitle": "Title",
                                   "Review_Status": "Acceptance",
                                   "Reviewer_Comments": "Comments",
                                   "Initial Acceptance of Professional Development Workshop": "Accept",
                                   "Initial Rejection of Professional Dev Workshop": "Reject"
                                   }

    # This variable points to where the program can find the abstract submission file downloaded from XCD
    path_to_pdw = "../Data/PDW_review_iitsec_2024.xlsx"

    # Pass these configuration parameters into the post abstraction submission closure analytics function inside the PaperAnalytics object to do the number crunching magic
    PDWAnalytics.PDWAnalytics().prePaperReviewAnalytics(
        path_to_pdw, standard_variables_list_pdw)

# Run Scholarship Analysis on request


def scholarship_analysis():
    """
    Run Scholarship Analysis on request.

    Args:
        None

    Returns:
        None
    """
    # Define List of submission file paths *need actual paths* - should be a config file
    path_to_papers = ["../Data/2019_Paper_Submissions.xlsx",
                      "../Data/2020_Paper_Submissions.xlsx",
                      "../Data/2021_Paper_Submissions.xlsx",
                      "../Data/2022_Paper_Submissions.xlsx",
                      "../Data/2023_Paper_Submissions.xlsx",
                      "../Data/2024_Paper_Submissions.xlsx"]

    # Define Path to awardee file path *need actual path* - should be part of a config file
    path_to_scholar = "../Data/Scholarships.xlsx"

    # Establish standard variable names map ("XCD Name":"New Name")
    standard_variables_list_schol = {"Subcommittee_Category": "Subcommittee",
                                     "Main_Subcommittee_Category": "Subcommittee",
                                     "Review_Status": "Abstract_Accept",
                                     "Paper_Review_Status": "Paper_Accept",
                                     "Education": "ED", "Training": "TR",
                                     "Simulation": "SIM",
                                     "Human Performance Analysis and Engineering": "HPAE",
                                     "Emerging Concepts and Innovative Technologies": "ECIT",
                                     "Policy, Standards, Management, and Acquisition": "PSMA",
                                     "Initial Acceptance at Abstract Stage": "Abstract_Accepted", 																								  			"Initial Rejection at Abstract Stage": "Abstract_Rejected", "Final Acceptance at Paper Stage": "Paper_Accepted",                             		  "Final Rejection at Paper Stage": "Paper_Rejected", "IITSEC Paper Approved": "Paper_Accepted", 														"Final Acceptance at Paper Review ": "Paper_Accepted", "Final Rejection at Paper Review": "Paper_Rejected",
                                     "Best Paper Winner": "Paper_Accepted",
                                     "I/ITSEC 2021 BP Paper Approved": "Paper_Accepted",
                                     "2023 Best Paper Nominee": "Paper_Accepted"}

    # Call ScholarAnalytics object
    ScholarAnalytics.ScholarAnalytics().Analytics(
        path_to_papers, path_to_scholar, standard_variables_list_schol)


# Run our main function to start the program
main()
