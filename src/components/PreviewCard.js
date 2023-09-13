
import React from "react";
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';

const PreviewCard = ({ item, onDelete, onSelect }) => {
    return (
        <>
          <Link to={`/detail/${item.id}`} onClick={onSelect}>
            <ListItem alignItems="flex-start">
                <ListItemText
                    primary={item.name}
                    secondary={
                        <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {item.subject}
                        </Typography>
                        {` -  ${item.body}`}
                        </React.Fragment>
                    }
                />
                <DeleteIcon onClick={onDelete} />
            </ListItem>
          </Link>
        </>
    )
}

export default PreviewCard