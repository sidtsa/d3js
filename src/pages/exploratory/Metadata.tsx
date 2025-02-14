import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const meta = `
1. Table Name: Sales

    Description: This table contains aggregated transactional sales data at a month level for various macrobricks with information pertaining to year of sales, month, macrobricks, and total sales unit 
Columns: 
- Year:  The year of the sales transaction.
- Month:  The month of the sales transaction.
- Year_month: The year and month of the sales transaction together. 
- Macrobrick: The segment to which the sales belong
- Brand: Name of the Brand corresponding to the sales
- Sales_Units: Total number of units sold each month

2. Table Name:Promotion

    Description: This table contains aggregated number of promotions given through different promotion channels at a month level for various macrobricks(segments) 
with information pertaining to year of sales, month, macrobricks, along with total numbers of face to face calls,Remote Calls,Phone Calls,Face To Face Events,
Remote_Events ,Cust_Email,Journey_Email
Columns: 
- Year:  The year of the sales transaction.
- Month:  The month of the sales transaction.
- Year_month: The year and month of the sales transaction together. 
- Macrobrick: The segment to which the sales belong
- Brand: Name of the Brand corresponding to the sales
- FaceToFace_Calls: Total number of face to face sales calls delivered by sales representatives in a macrobrick for a month 
- Remote_Calls: Total number of virutal sales calls delivered by sales representatives in a macrobrick for a month 
- Phone_Calls: Total number of phone calls delivered by sales representatives in a macrobrick for a month 
- FaceToFace_Events: Total number of face to face promotion events organized for a macrobrick for a month 
- Cust_Email: Total number of emails delivered by sales representatives in a macrobrick for a month 
- Journey_Email: Total number of promotional emails delivered in a macrobrick for a month


3. Table Name: MACROBRICK_MAPPING

    Description: This table serves a bridge file to map macrobricks to various segments 
Columns: 
- Segment: The homogeneous regions to which various macrobricks belong. There are two segment in this table- 'Region-1', 'Region-2'
- Macrobricks: Designated identifiers to target promotions


4. Table Name: Spends

    Description: This table contains information pertainign to cost for each promotion channel and the total budget spent for each channel 
Columns: 
- Channel: Name of each promotion channel utilized for sales
- Segment: The homogeneous regions to which various macrobricks belong
- Cost: Cost of delivering promotions for each channel
- Spend: Total amount of money spent through each promotion channel


`;
function Metadata() {
    return (
        <div>
            <ReactMarkdown>{meta}</ReactMarkdown>
        </div>
    );
}

export default Metadata;
