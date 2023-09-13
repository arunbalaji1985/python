import React from "react";
import { Link } from "react-router-dom";
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import PreviewCard from "./PreviewCard";
import Icon from '@mui/material/Icon';

const Sidebar = ({ data, onDelete, onSelect }) => {
  return (
    <nav className="navbar-menu" style={{ width: 250 }}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {data ? data.map(item => (
            <>
                <PreviewCard key={item.id} item={item} onDelete={(e) => onDelete(e, item.id)}
                    onSelect={() => onSelect(item.id)}/>
                <Divider variant="inset" component="li" />
            </>
        )) :
            <>
                <h2>No mail templates exist</h2>
            </>
        }
        <Link to="/detail/new">
            <Icon>add_circle</Icon>
        </Link>
      </List>
    </nav>
  );
};

export default Sidebar;
