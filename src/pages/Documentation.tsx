import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const datamodel = `
#### PATIENTDATA ####
Description: This table contains patient data such as gender, age, region, pay type, physician setting, physician specialty, comorbidity, start date following diagnosis date, regimen utilized, regimen class, year of regimen start, regimen complete or not, and time on therapy.

Columns:
* PATIENT_ID: Unique identifier for each patient.
* PATIENT_GENDER: The gender of the patient.
* PATIENT_AGE: The age of the patient.
* REGION: The region in which the patient resides.
* PAY_TYPE: The type of payment associated with the patient.
* PHYSICIAN_SETTING: The setting in which the patient's physician works.
* PHYSICIAN_SPECIALITY: The specialty of the patient's physician.
* COMORBIDITY: The comorbidity associated with the patient.
* START_DATE_FOLLOWING_DX_DATE_1L: The date the patient started following the diagnosis date.
* REGIMEN_UTILIZED_1L: The regimen utilized by the patient.
* REGIMEN_CLASS_1L: The class of the regimen utilized by the patient.
* YEAR_OF_1L_REGIMEN_START: The year the patient's regimen started.
* REGIMEN_COMPLETE_OR_NOT_1L: Flag indicating whether or not the patient's regimen is complete.
* TIME_ON_THERAPY: The amount of time the patient has been on therapy.

#### ADDRESS TABLE ####
    
  Description: 
  The ADDRESS table stores data related to healthcare providers (HCPs). 
  
  Columns: 
  * HCP_ID: Unique identifier for each healthcare provider. 
  * ADDRESS: The address of the healthcare provider. 
  
  #### PRODUCT TABLE ####
  
  Description: 
  The PRODUCT table stores data related to products. 
  
  Columns: 
  * PRODUCT_ID: Unique identifier for each product. 
  * NDC_NUMBER: National Drug Code number for the product. 
  * FORM: The form of the product (e.g. tablet, capsule, etc.). 
  * STRENGTH: The strength of the product (e.g. 500mg, 1000mg, etc.). 
  * GENERIC_NAME: The generic name of the product. 
  * FAMILY: The product family the product belongs to. 
  * MARKET: The market the product is intended for. 
  * IS_PRODUCT_FAMILY: A boolean value indicating whether the product belongs to a product family. 
  * CREATED_DATE: The date the product was created. 
  * UPDATED_DATE: The date the product was last updated. 
  * IS_COMPETITIVE_DATA: A boolean value indicating whether the product is competitive data. 
  * COMPETITIVE_DATA_TYPE: The type of competitive data the product is. 
  
  #### SALES TABLE ####
  
  Description: 
  The SALES table stores data related to sales transactions. 
  
  Columns: 
  * TRANS_ID: Unique identifier for each sales transaction. 
  * TRANS_DATE: The date of the sales transaction. 
  * TERRITORY_ID: The ID of the territory the sales transaction took place in. 
  * THERAPEUTIC_AREA: The therapeutic area the product belongs to. 
  * NRX: The number of prescriptions filled for the product. 
  * TRX: The total number of transactions for the product. 
  * HCP_ID: The ID of the healthcare provider associated with the sales transaction. 
  * PRODUCT_ID: The ID of the product associated with the sales transaction. 
  
  #### CUSTOMER TABLE ####
  
  Description: 
  The CUSTOMER table stores data related to healthcare providers (HCPs). 
  
  Columns: 
  * HCP_ID: Unique identifier for each healthcare provider. 
  * DEA_NUMBER: The Drug Enforcement Administration (DEA) number for the healthcare provider. 
  * NPI_ID: The National Provider Identifier (NPI) for the healthcare provider. 
  * FIRST_NAME: The first name of the healthcare provider. 
  * LAST_NAME: The last name of the healthcare provider. 
  * SPECIALTY_PRIMARY: The primary specialty of the healthcare provider. 
  * SPECIALTY_SECONDARY: The secondary specialty of the healthcare provider. 
  * FLAG_DO_NOT_CONTACT: A boolean value indicating whether the healthcare provider should not be contacted. 
  * EMAIL: The email address of the healthcare provider. 
  * CREATED_DATE: The date the healthcare provider was created. 
  
  #### ROSTER TABLE ####
  
  Description: 
  The ROSTER table stores data related to sales representatives. 
  
  Columns: 
  * RPTDT: The date of the roster. 
  * TERRITORY_ID: The ID of the territory the sales representative is assigned to. 
  * TERRITORY_NAME: The name of the territory the sales representative is assigned to. 
  * REP_TYPE: The type of sales representative (e.g. primary, secondary, etc.). 
  * FIRST_NAME: The first name of the sales representative. 
  * LAST_NAME: The last name of the sales representative. 
  * EMAIL: The email address of the sales representative. 
  * EMPLOYEEID: The employee ID of the sales representative. 
  * LATESTHIREDATE: The date the sales representative was hired. 
  * DISTRICT: The district the sales representative is assigned to. 
  * REGION: The region the sales representative is assigned to.
   

`;
function Documentaion() {
    return (
        <div>
            {/* <div style={{ marginLeft: "30px" }} dangerouslySetInnerHTML={{ __html: datamodel }}></div> */}
            <ReactMarkdown>{datamodel}</ReactMarkdown>
        </div>
    );
}

export default Documentaion;
