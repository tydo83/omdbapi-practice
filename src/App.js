// import axios from 'axios'
// import React, { Component } from 'react'

// export default class App extends Component {
//   state = {
//     movieName: "",
//     movieArray: [],
//     isError: false,
//     isNone: false,
//   }

//   async componentDidMount() { }

//   handleOnClick = async (event) => {
//     event.preventDefault();
    
//     if(this.state.movieName.length === 0) {
//       this.setState({
//         isError: true,
//       })
//       return
//     }

//     // if(this.state.movieArray.length === 0) {
//     //   this.setState({
//     //     isNone: false,
//     //   })
//     // }
    
//     try {
//       let result = await axios.get(
//         `http://www.omdbapi.com/?apikey=e5119d6&s=${this.state.movieName}`
//       )
//       this.setState({
//         movieArray: result.data.Search,
//         isError: false,
//       })
//     } catch (e) {
//       console.log(e)
//     }
//     console.log(this.state.movieArray)
//   }



//   handleOnChange = (event) => {
//     this.setState({
//       movieName: event.target.value
//     })
//   }

//   render() {
//     return (
//       <div>

//         <div>
//           {this.state.isError && (
//             <span style={{ color: "red" }}>
//               Sorry, you have to enter something
//             </span>
//           )}
//         </div>



//         <input
//           type="text"
//           onChange={this.handleOnChange}
//           value={this.state.movieName}
//         />
//         <button onClick={this.handleOnClick}>Search</button>
        
        

//         {this.state.movieArray.map((item) => {
//           return (
//           <div key={item.imdbID}>
//               <p>{item.Title}</p>
//               <img alt="" src={item.Poster} />
//           </div>
//           )
//         })}
      

//       </div>
//     )
//   }
// }

import React, { Component } from "react";
import axios from "axios";

require('dotenv').config()

export class Movie extends Component {
  state = {
    movieInput: "",
    movieArray: [],
    isLoading: false,
    isError: false,
    errorMessage: "",
  };
  async componentDidMount() {
    let randomTitle = ["batman", "superman", "lego", "alien", "predator"];
    let randomSelectedTitleIndex = Math.floor(
      Math.random() * randomTitle.length
    );
    this.setState({
      isLoading: true,
    });
    try {
      let movieData = await axios.get(
        `http://omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${randomTitle[randomSelectedTitleIndex]}`
      );
      this.setState({
        movieArray: movieData.data.Search,
        movieInput: "",
        isLoading: false,
        isError: false,
        errorMessage: "",
      });
    } catch (e) {}
  }
  handleMovieOnChange = (event) => {
    this.setState({
      movieInput: event.target.value,
      isError: false,
      errorMessage: "",
    });
  };
  handleSearchMovieError = async (data) => {
    // console.log(data);
    // console.log(data.Error);
    //console.log(data.Response);
    try {
      if (data.Response === "False") {
        if (data.Error === "Movie not found!") {
          this.setState({
            isError: true,
            errorMessage: "Movie Not found! check your title",
            isLoading: false,
          });
          return null;
        }
        if (data.Error == "Too many results.") {
          this.setState({
            isError: true,
            errorMessage: "Too many results please narrow your search!",
            isLoading: false,
          });
          return null;
        }
      } else {
        return data.Search;
      }
    } catch (e) {}
  };
  handleSearchMovieOnClick = async (event) => {
    //event.preventDefault();
    if (this.state.movieInput.length === 0) {
      this.setState({
        isError: true,
        errorMessage: "Please enter a movie Title!",
      });
      return;
    }
    this.setState({
      isLoading: true,
    });
    try {
      let movieData = await axios.get(
        `http://omdbapi.com/?apikey=6332b1e1&s=${this.state.movieInput}`
      );
      let movieArray = await this.handleSearchMovieError(movieData.data);
      if (movieArray === null) {
        return;
      } else {
        this.setState({
          movieArray: movieArray,
          movieInput: "",
          isLoading: false,
          isError: false,
          errorMessage: "",
        });
      }
      // if (
      //   movieData.data.Response === "False" &&
      //   movieData.data.Error === "Too many results."
      // ) {
      //   this.setState({
      //     isError: true,
      //     errorMessage: "Too many results please narrow your search!",
      //     isLoading: false,
      //   });
      //   return;
      // }
      // if (
      //   movieData.data.Response === "False" &&
      //   movieData.data.Error === "Movie not found!"
      // ) {
      //   this.setState({
      //     isError: true,
      //     errorMessage: "Sorry, movie not found! Please check your title",
      //     isLoading: false,
      //   });
      //   return;
      // }
    } catch (e) {
      console.log(e);
    }
  };
  showMovieArrayList = () => {
    return this.state.movieArray.map((item) => {
      return <div key={item.imdbID}>{item.Title}</div>;
    });
  };
  handleSearchOnEnter = async (event) => {
    if (event.key === "Enter") {
      this.handleSearchMovieOnClick();
    }
  };
  render() {
    return (
      <div style={{ marginTop: 50, textAlign: "center" }}>
        <div>
          {this.state.isError && (
            <span style={{ color: "red" }}>{this.state.errorMessage}</span>
          )}
        </div>
        <input
          style={{ width: 450 }}
          name="movieInput"
          onChange={this.handleMovieOnChange}
          onKeyPress={this.handleSearchOnEnter}
          value={this.state.movieInput}
        />
        <br />
        <button
          onClick={this.handleSearchMovieOnClick}
          style={{ margin: "25px 25px" }}
        >
          Search
        </button>
        {this.state.isLoading ? (
          <div>...Loading</div>
        ) : (
          this.showMovieArrayList()
        )}
        {/* <hr /> */}
        {/* {this.state.movieArray.map((item) => {
          return <div key={item.imdbID}>{item.Title}</div>;
        })} */}
      </div>
    );
  }
}
export default Movie;