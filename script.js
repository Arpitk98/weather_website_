const url = "https://api.openweathermap.org/data/2.5/forecast?q=Delhi&appid=182b09fb4489a304aa0bfd95a5883903";
const cityInput = document.getElementById("city");
const searchButton = document.getElementById("search-btn");
const locationButton = document.getElementById("location-btn");
const downSection = document.getElementById("down-section");
const upContent= document.getElementById("up-content");
const country= document.getElementById("country");  
const cardEle = document.getElementsByClassName("card"); 
const header1 = document.getElementById("header1"); 
const right = document.getElementById("right-main");
const leftEl= document.getElementById("left-id");
const heroEl= document.getElementById("hero-id");


const createweatherCard = (weatherItem) => {
    return `<div class="card"  style="width: 190px; height: 220px;" >
            <h4>(${weatherItem.dt_txt.split(" ")[0]})</h4>
            <img height="40px" width="40px" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="img">
            <p>Temperature: ${(Number(weatherItem.main.temp)-273.15).toFixed(2)}°C</p>
            <p>Wind: ${weatherItem.wind.speed} M/S</p>
            <p>Humidity: ${weatherItem.main.humidity}%</p> 
            <p>Weather: ${weatherItem.weather[0].description}</p> 
        </div> `; 
};


/// next 5 days forcasting

const  weathertoday = (result)=>{
    const arr = result.list[0];
    console.log(arr); 
     country.innerText =`${result.city.name}, ${result.city.country}` ;
     upContent.innerHTML = `<div class="up-card">
                        <p>Temperature: ${(arr.main.temp-273.15).toFixed(2)}°C</p>
                        <p>Wind: ${arr.wind.speed} M/S</p>
                        <p>Humidity: ${arr.main.humidity}%</p>
                    </div> 
                    <div class="desc">
                        <img width="100px" height="100px" src="https://openweathermap.org/img/wn/${arr.weather[0].icon}@2x.png" alt="weather">
                        <p>${(arr.weather[0].description)[0].toUpperCase() +(arr.weather[0].description).slice(1) }</p> 
                    </div>`;
};

const getCityCoordinates = ()=>{

    const city = cityInput.value.trim(); 
    if (!city) return;
    api_call(city); 

}; 

// api calll

const api_call= (city)=>{
      
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=182b09fb4489a304aa0bfd95a5883903`;

       fetch(API_URL).then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then((result) => {
        console.log(result);
       
        weathertoday(result); 
        const uniqueForecastDays = [];
        const forecastFivedays = result.list.filter((forecast) => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate))
                return uniqueForecastDays.push(forecastDate);
        })
        console.log(forecastFivedays);

        forecastFivedays.shift();
        downSection.innerHTML = "";
       
        forecastFivedays.forEach(weatherItem => {
            downSection.innerHTML += createweatherCard(weatherItem);
        });


    }).catch((error) => {
        alert("An error occurred while fetching the co-ordinates!");
    });

    cityInput.value="";

    header1.classList.add("header");
    header1.innerHTML=`<h3>Weather Dashboard </h3>`; 

    right.classList.remove("hide");

    heroEl.classList.remove("hero-hide");
    heroEl.classList.add("hero");

    leftEl.classList.remove("left-hide");
    leftEl.classList.add("left");


};

/// geolocation --> get city name and then find weather info

const getUserCoordinates = () => {
    
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude: lat, longitude: lon } = position.coords; 
                console.log(lat, lon);
                const reverse_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=182b09fb4489a304aa0bfd95a5883903`;

                fetch(reverse_URL)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json(); 
                    })
                    .then(res => {
                        const area = res[0].name;
                        console.log(area); 
                        api_call(area); 
                    })
                    .catch(error => {
                        console.error("Error fetching the reverse geocoding data:", error);
                    });
            },
            error => {
                console.error("Error getting user location:", error);
            }
        );
    
};




locationButton.addEventListener("click", getUserCoordinates);

searchButton.addEventListener("click",()=>{
    const city_name = cityInput.value.trim();
    if(city_name=="") {
     alert("Please Enter your city!");
     console.log("error");
        return; 
    } 
     api_call(city_name);

     });
