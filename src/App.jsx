import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./images/logo.png";

import {
  createTheme,
  useTheme,
  makeStyles,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  ThemeProvider,
  CssBaseline,
  responsiveFontSizes,
  InputAdornment,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Grid,
  Dialog,
  Slide,
  Divider,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  logo: {
    marginRight: 8,
    [theme.breakpoints.up("md")]: {
      marginLeft: 50,
    },
  },
  title: {
    fontFamily: "Gabriela",
  },
  header: {
    color: "#ff7c00",
    [theme.breakpoints.down("sm")]: {
      margin: "1em 0",
    },
    [theme.breakpoints.up("md")]: {
      lineHeight: "2em",
      letterSpacing: ".35px",
      fontWeight: "800",
      fontSize: "5rem",
    },
  },
  appbar: {
    background: theme.palette.grey[900],
    borderBottom: "1px solid #ff7c00",
  },
  itemsContainer: {
    border: "2px solid #ff7c00",
    marginTop: 64,
    borderRadius: 8,
  },
  gridItem: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  imageItem: {
    "&:hover": {
      transition: "transform 50ms linear, object-position 50ms linear",
      transform: "scale(1.25)",
      objectPosition: "0 40px",
    },
  },
  dialogContainer: {
    background: theme.palette.grey[900],
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dialogAppBar: {
    position: "relative",
    width: "100%",
    height: 144,
    [theme.breakpoints.down("sm")]: {
      height: 96,
    },
    [theme.breakpoints.down("xs")]: {
      height: 80,
    },
  },
  dialogCloseBtn: {
    position: "absolute",
    // top: 20,
    right: 0,
    margin: "18.7667px 0",
  },
}));

function App() {
  let theme = useTheme();
  theme = createTheme({
    palette: {
      type: "dark",
      background: {
        default: theme.palette.grey[900],
      },
    },
  });
  theme = responsiveFontSizes(theme);
  const classes = useStyles();

  const [searchField, setSearchField] = useState("");
  const [playerData, setPlayerData] = useState(null);
  const [resStatus, setResStatus] = useState(null);
  const [championsData, setChampionsData] = useState(null);
  const [champions, setChampions] = useState(null);
  const [filteringChamps, setFilteringChamps] = useState(false);

  useEffect(() => {
    async function fetchChamps() {
      const res = await fetch(
        "https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json"
      );
      const data = await res.json();
      setChampionsData(data);
      setChampions(data.data);
    }
    fetchChamps();
  }, []);

  const apiKey = "RGAPI-9327d054-0c8b-463a-ad3f-299916cbf993";

  const apiEndpoint =
    "https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/";
  const iconURL =
    "http://ddragon.leagueoflegends.com/cdn/12.7.1/img/profileicon/";

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await fetch(`${apiEndpoint}${searchField}?api_key=${apiKey}`);
    const data = await res.json();
    setSearchField("");
    setResStatus(res.status);
    setPlayerData(data);
    console.log("Status", resStatus);
  };

  const handleChange = (e = { target: { value: "" } }) => {
    setFilteringChamps(true);
    // console.log(e.target.value);
    setSearchField(e.target.value);
    console.log(searchField);

    const filteredChamps = Object.entries(championsData.data).filter(
      ([key, value]) =>
        key.toLowerCase().trim().includes(e.target.value.toLowerCase().trim())
    );

    setChampions(Object.fromEntries(filteredChamps));
    setFilteringChamps(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar className={classes.appbar}>
          <Toolbar>
            <Avatar
              variant="square"
              alt="logo"
              src={logo}
              className={classes.logo}
            />
            <Typography variant="h6" className={classes.title}>
              League Stats
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="baseline" style={{ marginTop: 96 /*64*/ }}>
          <Typography
            variant="h1"
            component="h1"
            className={`${classes.title} ${classes.header}`}
          >
            Champions Library
          </Typography>
          <form onSubmit={handleSearch}>
            <TextField
              variant="outlined"
              type="text"
              value={searchField}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => handleChange()}
                    style={{ width: 24, paddingRight: 16 }}
                  >
                    <InputAdornment position="end">
                      <Close />
                    </InputAdornment>
                  </IconButton>
                ),
              }}
            />
            {/*<Button variant="contained" color="primary" type="submit">
              Search Summoner
            </Button>*/}
          </form>
          {/*{resStatus === 200 && playerData ? (
            <>
              <img
                src={`${iconURL}${playerData.profileIconId}.png`}
                alt={playerData.name}
              />
              <Typography variant="h5" component="h2">
                {playerData.name} - Level {playerData.summonerLevel}
              </Typography>
            </>
          ) : (
            resStatus && (
              <Typography variant="h5" component="h2">
                No Player Data Found
              </Typography>
            )
          )}*/}
          <Container
            maxWidth="md"
            fixed
            disableGutters
            className={classes.itemsContainer}
          >
            {champions && !filteringChamps ? (
              <Grid container>
                {Object.entries(champions).map(([key, value], i) => (
                  <CustomGrid keyProp={key} valueProp={value}>
                    <ImageList
                      rowHeight={452}
                      cols={1}
                      className={classes.imageList}
                    >
                      <ImageListItem key={i}>
                        <Image keyProp={key} />
                        <ImageListItemBar title={key} />
                      </ImageListItem>
                    </ImageList>
                  </CustomGrid>
                ))}
              </Grid>
            ) : (
              <h1>Loading...</h1>
            )}
          </Container>
        </div>
      </div>
    </ThemeProvider>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomGrid = ({ children, keyProp, valueProp }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Grid
        item
        md={3}
        sm={6}
        xs={12}
        className={classes.gridItem}
        onClick={() => setOpen(true)}
      >
        {children}
      </Grid>
      <ChampDialog
        open={open}
        setOpen={setOpen}
        keyProp={keyProp}
        valueProp={valueProp}
      />
    </>
  );
};

const ChampDialog = ({ open, setOpen, keyProp, valueProp }) => {
  const classes = useStyles();
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
      className={classes.dialogContainer}
    >
      <Container className={classes.dialogContent}>
        <div className={classes.dialogAppBar}>
          <IconButton
            edge="end"
            onClick={() => setOpen(false)}
            className={classes.dialogCloseBtn}
          >
            <Close />
          </IconButton>
        </div>
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${keyProp}_0.jpg`}
          width={900}
          style={{ maxWidth: "100%" }}
        />
        <Typography variant="h1" component="h2" className={classes.title}>
          {keyProp}
        </Typography>
        <Typography variant="h4" component="h3">
          {valueProp.title}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          className={classes.title}
          style={{
            width: 900,
            maxWidth: "100%",
            marginTop: 64,
            border: "2px solid",
            borderRadius: 8,
            padding: 32,
          }}
        >
          {valueProp.blurb}
        </Typography>
        <Divider />
        <h1>Test</h1>
      </Container>
    </Dialog>
  );
};

const Image = ({ keyProp }) => {
  const classes = useStyles();
  const [coverLoaded, setCoverLoaded] = useState(false);
  return (
    <>
      {!coverLoaded && (
        <Skeleton
          animation="wave"
          // className={classes.coverSkeleton}
          variant="rect"
          width="100%"
          height={452}
        />
      )}
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${keyProp}_0.jpg`}
        alt={keyProp}
        onLoad={() => setCoverLoaded(true)}
        className={classes.imageItem}
      />
    </>
  );
};

export default App;
