import React, { useState, useEffect } from 'react';
import axios from "axios";

import {
  Avatar,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';

import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import SalesColumnChart from './SalesColumnChart';
import MainCard from 'components/MainCard';
import MeanCard from 'components/cards/statistics/MeanCard';

import { CheckOutlined, InfoOutlined } from '@ant-design/icons';  
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

const DashboardDefault = () => {
  
  const [atualizacao, setAtualizacao] = useState(0);
  const [loading, setLoading] = useState(true); 
  const [info, setInfo] = useState();

  const [nh3, setNh3] = useState([20]);
  const [co2, setCo2] = useState([20]);
  const [temp, setTemp] = useState([20]);
  const [umidade, setUmidade] = useState([75]);

  const fetchData = async () => {
    try {
      
      const response = await axios.post("http://localhost:5000/api/predict");
      setInfo(response.data);
      setLoading(false);

    } catch (error) {
      console.error("Erro: " + error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    if (info) {

      const newNh3 = [...nh3, info.row_data.nh3];
      setNh3(newNh3);
      
      const newCo2 = [...co2, info.row_data.co2];
      setCo2(newCo2);

      const newTemp = [...temp, info.row_data.TEMP_MIN];
      setTemp(newTemp);
      
      const newUm = [...umidade, info.row_data.humidity];
      setUmidade(newUm);

      console.log(temp);

      setAtualizacao(atualizacao + 1);
      console.log(nh3);
      console.log(co2);
      console.log(temp);
      console.log(umidade);
    }
  }, [info]);  

  const atualizar = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/predict");
      setInfo(response.data);

    } catch (error) {
      console.error("Erro ao atualizar: " + error);
    }
  };

  const [slot, setSlot] = useState('week');
  if (loading) {
    return <p>Carregando...</p>; 
  }

  if (!info) {
    return <p>Dados não disponíveis.</p>;
  }

  return (

    <Grid container rowSpacing={4.5} columnSpacing={2.75}>

      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <MeanCard title="Amônia (NH3)" count={nh3[nh3.length-1] + ' ppm'} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <MeanCard title="Dióxido de carbono (CO2)" count={co2[co2.length-1] + ' ppm'} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <MeanCard title="Temperatura" count={temp[temp.length-1] + ' ºC'} />
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <MeanCard title="Umidade" count={umidade[umidade.length-1] + ' %'} />
      </Grid>

      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Relação de gáses por hora</Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={0}>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                variant={slot === 'month' ? 'outlined' : 'text'}
              >
                Horária
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                variant={slot === 'week' ? 'outlined' : 'text'}
              >
                Diária
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
            <IncomeAreaChart slot={slot} nh3={nh3} co2={co2} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Média de Temperatura por dia</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                Temperatura (ºC)
              </Typography>
            </Stack>
          </Box>
          <MonthlyBarChart dados={temp} />
        </MainCard>
      </Grid>

      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Temperatura x Umidade</Typography>
          </Grid>
        </Grid>
        <MainCard sx={{ mt: 1.75 }}>
          <Stack spacing={1.5} sx={{ mb: -12 }}>
            <Typography variant="h4">|</Typography>
          </Stack>
          {temp }
          <SalesColumnChart temperatura={temp} umidade={umidade} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Predição da saúde da baia</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List
            component="nav"
            sx={{
              px: 0,
              py: 0,
              '& .MuiListItemButton-root': {
                py: 1.5,
                '& .MuiAvatar-root': avatarSX,
                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
              }
            }}
          >
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: 'success.main',
                    bgcolor: 'success.lighter'
                  }}
                >
                  { info.prediction[0] === 0 ? (<CheckOutlined />) : (<InfoOutlined />) }
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Depois de Amanhã</Typography>} />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                <Typography variant="subtitle1" noWrap>
                  { info.prediction[0] === 0 ? 'Saudável' : 'Anormal' }
                </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: 'success.main',
                    bgcolor: 'success.lighter'
                  }}
                >
                  <CheckOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Amanhã</Typography>} />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    Saudável
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  sx={{
                    color: 'success.main',
                    bgcolor: 'success.lighter'
                  }}
                >
                  <CheckOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={<Typography variant="subtitle1">Hoje</Typography>} />
              <ListItemSecondaryAction>
                <Stack alignItems="flex-end">
                  <Typography variant="subtitle1" noWrap>
                    Saudável
                  </Typography>
                </Stack>
              </ListItemSecondaryAction>
            </ListItemButton>
          </List>
        </MainCard>
      </Grid>

      <button onClick={atualizar}>atualizar</button>

    </Grid>
  );
};

export default DashboardDefault;
