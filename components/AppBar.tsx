import AppBar from '@material-ui/core/AppBar/AppBar';
import IconButton from '@material-ui/core/IconButton/IconButton';
import { Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import Typography from '@material-ui/core/Typography/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/styles';
import * as React from 'react';
import { useState } from 'react';
import { User } from '../domain/user';
import MyDrawer from './drawer/Drawer';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';

const useStyles = makeStyles((theme: Theme) => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
}));

interface MyAppBarProps {
  user: User | null;
  onClickLogout: () => void;
}

// tslint:disable-next-line variable-name
export default function MyAppBar(props: MyAppBarProps) {
  const classes = useStyles(undefined);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const handleDrawer = (open: boolean) => () => setDrawerOpen(open);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <MyDrawer
          open={isDrawerOpen}
          onClose={handleDrawer(false)}
          onClickSideList={handleDrawer(false)}
        />
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            TODO App
          </Typography>
          {props.user ? (
            <ProfileButton
              user={props.user}
              onClickLogout={props.onClickLogout}
            />
          ) : (
            <LoginButton />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
