const userTab=document.querySelector("[user-data]");
const searchTab=document.querySelector("[search-data]");

const accessLocationPage=document.querySelector('.grant_location');
const searchBar=document.querySelector('.search_cont');
const loadingPage=document.querySelector('.loading_cont');
const weatherdataPage=document.querySelector('.weather_info');



let currentTab = userTab;
const Api_key='838cc3c72713c05f103385ae6ab84173';
currentTab.classList.add("current-tab");
getfromlocalstorage();



userTab.addEventListener("click" , () => {
    switchTab(userTab);
});

searchTab.addEventListener("click" , () => {
    switchTab(searchTab);
});

function switchTab(clickedTab){

    if (clickedTab != currentTab ){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        searchInput.value=null;
        errorPage.classList.remove("active");

        if(!searchBar.classList.contains("active")){
            searchBar.classList.add("active");
            accessLocationPage.classList.remove("active");
            weatherdataPage.classList.remove("active");

        }
        else{
            searchBar.classList.remove("active");
            weatherdataPage.classList.remove("active");
            getfromlocalstorage();
        }
    }

}

function getfromlocalstorage(){
    const localcoordinates=sessionStorage.getItem("current-Coordinates");
    if(!localcoordinates){
        accessLocationPage.classList.add("active");
        weatherdataPage.classList.remove("active");
    }
    else{
        const coordinates=JSON.parse(localcoordinates);
        fetchuserWeather(coordinates);
    }
}

async function fetchuserWeather(coordinates) {

    const {lat,longi}=coordinates;
     accessLocationPage.classList.remove("active");
     loadingPage.classList.add("active");

  

    try {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${Api_key}&units=metric`);
        const data=await response.json();
        renderdata(data);
        console.log("data",data)
        loadingPage.classList.remove("active");
        weatherdataPage.classList.add("active");
       
        
    } catch (error) {
        loadingPage.classList.remove("active");
        console.log("Server Error");
    }

}

function renderdata(data){

    const cityName=document.querySelector("[data-cityname]");
    const countryIcon=document.querySelector("[data-countryflag]");
    const weatherDesc=document.querySelector("[data-description]");
    const temperature=document.querySelector("[data-temperature]");
    const weatherIcon=document.querySelector("[data-weathericon]");
    const windSpeed=document.querySelector("[data-speed]");
    const humidity=document.querySelector("[data-humidity]");
    const clouds=document.querySelector("[data-cloud]");


    cityName.innerHTML=data?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerHTML=data?.weather?.[0]?.description;
    temperature.innerText=`${data?.main?.temp} °C` ;
    weatherIcon.src= `https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}.png`;
    windSpeed.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity} %`;
    clouds.innerText=`${data?.clouds?.all} %`;
}

const grantAccessButton = document.querySelector("[accesslocation]")

grantAccessButton.addEventListener("click" , accessLocation);

function accessLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        alert("Geolocation doesn't support on your system !");
    }
}

function showposition(position){
    const currentCoordinates={
        lat: position.coords.latitude,
        longi: position.coords.longitude,
    }

    sessionStorage.setItem("current-Coordinates",JSON.stringify(currentCoordinates));

    fetchuserWeather(currentCoordinates);   

}



const searchInput=document.querySelector("[searchedCityName]");
const searchButton=document.querySelector("[searchbtn]");

searchInput.addEventListener("keypress" , function(event) {

    console.log("submitteddata")

    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
      }  

});

searchButton.addEventListener("click",(e) =>{
    (e).preventDefault();
    if(searchInput.value ===""){
        return;
    }
    else{
        fetchSearchedWeather(searchInput.value);
    }
});

const errorPage =document.querySelector("[errorpage]");

async function fetchSearchedWeather(city){

    try {
        loadingPage.classList.add("active");
        weatherdataPage.classList.remove("active");
        accessLocationPage.classList.remove("active");
        const weather= await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${Api_key}&units=metric`);
        const weatherInfor=await weather.json();
        loadingPage.classList.remove("active");
        weatherdataPage.classList.add("active");
        errorPage.classList.remove("active");
        renderdata(weatherInfor);

        if(weatherInfor.sys== null){

            weatherdataPage.classList.remove("active");
            errorPage.classList.add("active");

        }
    
       
    } catch(error) {
        loadingPage.classList.remove("active");
        alert("error in api");
        console.log("error=",error)
        
    }   

};