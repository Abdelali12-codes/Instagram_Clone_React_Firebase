import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {MuiThemeProvider} from '@material-ui/core/styles'
import {createMuiTheme} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import GridOnOutlined from '@material-ui/icons/GridOnOutlined';
import LiveTv from '@material-ui/icons/LiveTv';
import BookmarkBorderOutlined from '@material-ui/icons/BookmarkBorderOutlined';
import {SavedPosts} from '../SavedPosts'
import Posts from './Posts'
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}
const theme = createMuiTheme({
    palette :{
        primary :{
            main :'#262626' ,
        }
    }
})
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop :'9vh' ,
    backgroundColor: theme.palette.background.paper,
  },
 
}));

export default function Notifications() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
     <MuiThemeProvider theme={theme}>
    <div className={classes.root}>
   
      <Paper  style={{width:'500px', margin:'0 auto'}}>
        <Tabs
          
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="off"
          indicatorColor='primary'
          aria-label="scrollable prevent tabs example"
        >
          <Tab icon={<GridOnOutlined />} aria-label="indexes" {...a11yProps(0)} />
          <Tab icon={<LiveTv />} aria-label="tv" {...a11yProps(1)} />
          <Tab icon={<BookmarkBorderOutlined />} aria-label="grid" {...a11yProps(2)} />
        </Tabs>
      </Paper>
      <TabPanel value={value} index={0}>
       <Posts/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        LiveTv
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SavedPosts/>
      </TabPanel>
     </div> 
    </MuiThemeProvider>
  );
}