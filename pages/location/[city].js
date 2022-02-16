import React from 'react';
import cities from '../../lib/city.list.json'

export async function getServerSideProps(context) {
  const city = getCity(context.params.city);
  const slug = context.params.city;
  
  if (!city) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: slug
    },
  };
}

const getCity = (param) => {
  const cityParam = param.trim();
  //get the city id
  const splitCity = cityParam.split("-");
  //grab the last array element of splitCity
  const id = splitCity[splitCity.length - 1];
  if (!id) {
      return null;
  }

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