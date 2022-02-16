import React from 'react';
import cities from '../../lib/city.list.json'

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

  return {
    props: {
      slug: slug
    },
  };
}

console.log(process.env.API_KEY);

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

export default function City({slug}) {
  return (
    <div>
      <h1>City Page</h1>
      <h2>{slug}</h2>
    </div>
  )
}
