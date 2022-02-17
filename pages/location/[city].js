import Head from 'next/head';
import React from 'react';
import cities from '../../lib/city.list.json'
import TodaysWeather from '../../components/TodaysWeather'

export async function getServerSideProps(context) {
  //center call to grab information`city`
  const city = getCity(context.params.city);
  const slug = context.params.city;
  //check
  if (!city) {
    return {
      notFound: true,
    };
  }

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
  
  return {
    props: {
      city: city,
      timezone: date.timezone,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: getHourlyWeather(data.hourly),
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
  //connect json file
  const city = cities.find(city => city.id.toString() == id);
  if (city) {
    return city;
  } else {
    return null;
  }
};

//helper function for hourly data
const getHourlyWeather = (hourlyData) => {
  const current = new Date();
  current.setHours(current.getHours(), 0, 0, 0);
  const tomorrow = new Date(current);
  tomorrow.setDate(tomorrow.getDate() + 1); //plus a day
  tomorrow.setHours(0, 0, 0, 0);
 
  //divide by 1000 to get timestamps in seconds
  const currentTimeStamp = Math.floor(current.getTime() / 1000);
  const tomorrowTimeStamp = Math.floor(tomorrow.getTime() / 1000);
  const todayData = hourlyData.filter(data => data.dt < tomorrowTimeStamp);

  return todayData;
}

export default function City({
  hourlyWeather,
  currentWeather,
  dailyWeather,
  city,
  timezone
}) {
  console.log(dailyWeather);
  return (
    <div>
      <Head>
        <title>{city.name} Weather - Next Weather App</title>
      </Head>

      <div className="page-wrapper"> 
        <div className="container">
          <TodaysWeather city={city} weather={dailyWeather[0]} timezone={timezone}/>
        </div>
      </div>
    </div>
  )
}
