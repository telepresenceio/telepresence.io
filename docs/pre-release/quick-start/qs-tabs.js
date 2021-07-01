import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CodeBlock from '@src/components/CodeBlock';
import LinuxIcon from '@src/assets/icons/linux.inline.svg';
import AppleIcon from '@src/assets/icons/apple.inline.svg';
import WindowsIcon from '@src/assets/icons/windows.inline.svg';

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
      {value === index && (
        <Box p={3}>
          {children}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar elevation={0} style={{ background: 'transparent', color: 'black', borderBottom: '1px solid #e8e8e8', }} position="static">
        <Tabs value={value} onChange={handleChange} aria-label="operating system tabs">
          <Tab icon={<AppleIcon />} label="macOS" {...a11yProps(0)} style={{ minWidth: "10%", textTransform: 'none' }} />
          <Tab icon={<LinuxIcon />} label="Linux" {...a11yProps(1)} style={{ minWidth: "10%", textTransform: 'none' }} />
          <Tab icon={<WindowsIcon />} label="Windows" {...a11yProps(2)} style={{ minWidth: "10%", textTransform: 'none' }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <CodeBlock>
        {
          '# Install via brew:' +
          '\n' +
          'brew install datawire/blackbird/telepresence' +
          '\n \n' +
          '# OR install manually:' +
          '\n' +
          '# 1. Download the latest binary (~60 MB):' +
          '\n' +
          'sudo curl -fL https://app.getambassador.io/download/tel2/darwin/amd64/latest/telepresence -o /usr/local/bin/telepresence' +
          '\n \n' +
          '# 2. Make the binary executable:' +
          '\n' +
          'sudo chmod a+x /usr/local/bin/telepresence'
        }
        </CodeBlock>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CodeBlock>
        {
          '# 1. Download the latest binary (~50 MB):' +
          '\n' +
          'sudo curl -fL https://app.getambassador.io/download/tel2/linux/amd64/latest/telepresence -o /usr/local/bin/telepresence' +
          '\n \n' +
          '# 2. Make the binary executable:' +
          '\n' +
          'sudo chmod a+x /usr/local/bin/telepresence'
        }
        </CodeBlock>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CodeBlock>
        {
          '# 1. Download the latest binary (~50 MB):' +
          '\n' +
          'sudo curl -fL https://app.getambassador.io/download/tel2/windows/amd64/latest/telepresence.msi -o C:\\Temp\\telepresence.msi' +
          '\n \n' +
          '# 2. Run the installer in PowerShell' +
          '\n' +
          'Start-Process C:\\Temp\\telepresence.msi'
        }
        </CodeBlock>
      </TabPanel>
    </div >
  );
}
