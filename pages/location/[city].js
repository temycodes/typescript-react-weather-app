import Head from 'next/head';
import React from 'react';
import cities from '../../lib/city.list.json'
import TodaysWeather from '../../components/TodaysWeather';
import moment from 'moment-timezone';
import HourlyWeather from '../../components/HourlyWeather'

 //start engine ~ center call to grab information`city`
export async function getServerSideProps(context) {
  const slug = context.params.city;
  const city = getCity(context.params.city);
  
  //redirect to a 404 error
  if (!city) {
    return {
      notFound: true,
    };
  }

  //make request to API
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&exclude=minutely&units=metric`
  );

  const data = await res.json();

  if (!data) {
    return {
      notFound: true,
    }
  }

  // console.log(data);
  const hourlyWeather = getHourlyWeather(data.hourly, data.timezone) //*timezone to function
  
  return {
    props: {
      city: city,
      timezone: data.timezone,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: hourlyWeather
    },
  };
}

//helper function
const getCity = (param) => {
  const cityParam = param.trim();
  //get the city id ~ split params with a dash -
  const splitCity = cityParam.split("-");
  //grab the last array element of splited city
  const id = splitCity[splitCity.length - 1];
  //if no date is specified
  if (!id) {
      return null;
  } 
  //connect json file and find city results
  const city = cities.find(city => city.id.toString() == id);
  if (city) {
    return city;
  } else {
    return null;
  }
};

//helper function for local timezone machine
const getHourlyWeather = (hourlyData, timezone) => {
  const endOfDay = moment().tz(timezone).endOf('day').valueOf(); //valueOf gives a unique timestamp
  const eodTimeStamp = Math.floor(endOfDay / 1000) //from the milliseconds into seconds
  const todayData = hourlyData.filter(data => data.dt < eodTimeStamp);

  return todayData;
}

export default function City({
  hourlyWeather,
  currentWeather, 
  dailyWeather,
  city,
  timezone
}) {
  // console.log(hourlyWeather);
  return (
    <div>
      <Head>
        <title>{city.name} Weather - Next Weather App</title>
      </Head>

      <div className="page-wrapper"> 
        <div className="container">
          <TodaysWeather city={city} weather={dailyWeather[0]} timezone={timezone}/>
          <HourlyWeather weather={dailyWeather[0]} hourlyWeather={hourlyWeather} timezone={timezone}/>
        </div>
      </div>
    </div>
  )
}
