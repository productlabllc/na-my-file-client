import React, { useState, useContext } from 'react';
import { CssBaseline, Grid } from '@mui/material';

const SplitPaneImageLeft = (props: any) => {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(/paperwork-0${Math.floor(Math.random() * 5) + 1}.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) => (t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900]),
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      {props.children}
    </Grid>
  );
};

export default SplitPaneImageLeft;
