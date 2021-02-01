import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import styled from "styled-components";
import Message from "./Messages";
import IconButton from "@material-ui/core/IconButton";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
// import SendIcon from '@material-ui/icons/Send';
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import querString from "query-string";
import { Redirect, useLocation } from "react-router-dom";
import "./Tabs.css";
import RightSide from "./RightSide";
import { MessageIns } from "../../components/Room";

const Header = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  display: grid;
  grid-template-columns: 3fr 1fr;
`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#262626",
    },
  },
});
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const SimpleTabs = ({ auth: { uid } }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const location = useLocation();
  const { roomId, roomname, userId } = querString.parse(location.search);
  const { roomid, userid } = querString.parse(location.search);
  useEffect(() => {}, []);
  if (!uid) return <Redirect to="/login" />;
  return (
    <MuiThemeProvider theme={theme}>
      <div className="wrapper">
        <div className="childern">
          <div className="child__left">
            <Header>
              <div className="header__insta">
                <span className="item__insta">Direct</span>
              </div>
              <div className="header__insta">
                <IconButton>
                  <BorderColorIcon />
                </IconButton>
              </div>
            </Header>
            <div className={classes.root}>
              <Paper position="static">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="simple tabs example"
                  variant="scrollable"
                  scrollButtons="off"
                  indicatorColor="primary"
                >
                  <Tab label="Principal" {...a11yProps(0)} />
                  <Tab label="General" {...a11yProps(1)} />
                </Tabs>
              </Paper>
              <TabPanel value={value} index={0}>
                <Message userid={userId} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Message userid={userId} />
              </TabPanel>
            </div>
          </div>
          {roomId ? (
            <div className="child__right">
              <MessageIns roomId={roomId} roomname={roomname} userid={userId} />
            </div>
          ) : (
            <div className="child__right">
              <RightSide />
            </div>
          )}
        </div>
      </div>
    </MuiThemeProvider>
  );
};
const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
});
export default connect(mapStateToProps)(SimpleTabs);
