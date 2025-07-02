import { useState, useEffect } from 'react'
import './App.css'
import Header from './header.jsx'
import Footer from './footer.jsx'
import './LoginBox.css';
import Image from 'react-bootstrap/Image';
import Summarizer from "./components/Summarizer";


function App() {
  const [gameData, setgameData] = useState([])
  const[userData, setUserData] = useState([])

  const[loggedIn, setLoggedIn] = useState(false)

  let[newUser, setNewUser] = useState('');
  let [passwordNew, setPasswordNew] = useState('');

  function changeLoginStatus(){
    if(loggedIn===false){
      setLoggedIn(true)
    }else if(loggedIn===true){
      setLoggedIn(false)
    }
  }

  function handleLogout() {
    putRequest()
    setSavedGames([])
    setNewUser('')
    setPasswordNew('')
    changeLoginStatus()
  }

  //Funtion to make an API call to get video game data to show on the page
  async function getData() {
    const response = await fetch("https://api.rawg.io/api/games?key=2a81c7e237774deeb08ce07a5fc6cb15&ordering='metacritic'&page_size=32")
    let responseData = await response.json()
    responseData = responseData.results
    let gameData = responseData.map((game) => ({
      name: game.name,
      background_image: game.background_image,
      metacritic: game.metacritic,
      released: game.released,
      id: game.id
    }))
    setgameData(gameData)
  }

  //funtion to add the video game data to the database. It is called 
  //When the user clicks the logout button
  async function putRequest() {
  fetch('https://video-game-libraryapi.onrender.com/userdata/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: userData[0].username,
      game_data: savedGames,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Updates saved.');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

  //Get the user info when they login and change the login status
  
    let handleSubmit = async (e) => {
      e.preventDefault();
      let user = newUser
      let url = 'https://video-game-libraryapi.onrender.com/userdata/'
      let userURL = url + user
      try{
      const response = await fetch(userURL)
      let userInfo = await response.json()
      if(newUser===userInfo[0].username && passwordNew===userInfo[0].password){
        //alert("Login Successful")
        changeLoginStatus()
        setUserData(userInfo)
        setSavedGames(userInfo[0].game_data)
      }
      else{
        alert("Try again")
      }}catch(error){
        alert("Try again")
      }
    };

// Render the games when the page loads

  useEffect(() => {
    getData()
  }, [])

  let [savedGames, setSavedGames] = useState([]);
  let handleAddGame = (game) => {
    if (!savedGames.find(g => g.id === game.id)) {
      setSavedGames([...savedGames, game]);
    }
  };

  return (
    <div>
      {/* display the login box, header, and footer */}
      {/* userlogin={userData[0] ? userData[0].username: ""} password={userData[0] ? userData[0].password: "" */}
      <div>{loggedIn ? (
          <div className="login-box" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{display:'flex', alignItems:'center'}}>
              <div style={{padding:'20px'}}><Image src={userData[0].profile_img} roundedCircle style={{height:'100px', width:'100px'}} /></div><p>Welcome, {newUser}!</p>
              </div>
              <button id="logout" onClick={()=>{handleLogout()}}>Log Out</button>
          </div>
        ): ( 
          <div className="login-box">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
              
                onChange={e => setNewUser(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                
                onChange={e => setPasswordNew(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        ) }
      </div>
      
      <Header />
      <div className="sidebar">
        <a href="#" className="active">Saved Games</a>
        <div className="dropdown">
          <select id="myDropdown">
            {savedGames.map((game) => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="games-list">
        {gameData.map((game) => (
          <div key={game.id} className="game-card">
            <img src={game.background_image} alt={game.name} className="game-image" />
            <h2>{game.name}</h2>
            <p>Metacritic: {game.metacritic}</p>
            <p>Released: {game.released}</p>
            <button id="addGameButton" onClick={() => handleAddGame(game)}>Add game</button>
          </div>
        ))}
      </div>
      <Summarizer />
      <Footer />
    </div>
  )
}

export default App

