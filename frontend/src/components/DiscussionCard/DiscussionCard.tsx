import React from "react";
import { DiscussionDTO } from "../../dtos/DiscussionDTO";
import { Card, CardActionArea } from "@mui/material";

interface Prop {
	discussion: DiscussionDTO;
}
const DiscussionCard = ({ discussion }: Prop) => {
	return (
		<Card sx={{ borderRadius: 0.7, height:200, width:500 }} elevation={3}>
			<CardActionArea
          
            
            >  <img src={discussion.BackgroundImageLink}/></CardActionArea>
		</Card>
	);
};

export default DiscussionCard;
