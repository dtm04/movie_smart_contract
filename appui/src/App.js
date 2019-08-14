import React, { Component, useState } from "react";
import { Button, Form, Col, Row, Container, Alert } from "react-bootstrap";
import "./ShowMovies";
import { ratingContract, account0 } from "./config";
import { ShowMovies } from "./ShowMovies";

class App extends Component {

  /*
      Making the move list persist is still an issue.
      I added a getter for movies list in the contract.
      I think the issue is the getMoviesList() call is returning 
      a promise, and I need to wait for it to resolve before render().

      I usually use async/await, but one option might returning
      serialized JSON from the contract.  Or use one of the lifecycle
      methods in react to set the state properly.

      This current version isn't working, going to work on the final project.
      I'll let you know if I get it working 100%.

      - Don
   */
  constructor(props) {
    super(props);
    this.state = {
      movies: [
        { name: "Avatar", rating: 0 },
        { name: "Inception", rating: 0 },
        { name: "Spider Man: Home Coming", rating: 0 },
        { name: "Star Wars: The last Jedi", rating: 0 }
      ],  
      movieName: "",
      showAlert: false,
    };
    this.state.movies = this.getMoviesList();
    this.setVoteTotals();
    console.log(this.state.movies);
    this.handleVoting = this.handleVoting.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getAlert = this.getAlert.bind(this);
  }

  /**
   * Get the list of movies from contract and assisn them
   * to an array of objects with name: movie attribute.
   * @return {[array]} [array of JSON]
   */
  getMoviesList() {
    try {
      // public var automatic getter in .sol ?
      let movieArray = [];
      let result = ratingContract.methods.getMovieNames().call()
        .then(res => {
          for(let mov of result) {
              let temp = {
                name: mov
             }
            movieArray.push(mov);
          }
        });
        return movieArray;  
    } catch(e) {
      console.log(e);
    }
  }

  /**
   * Function used to persist voting totals between page refresh.
   */
  setVoteTotals() {
    let app = this;
    for(let mov of this.state.movies) {
      let movie = mov.name;
      ratingContract.methods
        .totalVotesFor(movie)
        .call()
        .then(function(votes) {
          app.setState({
            movies: app.state.movies.map(el =>
              el.name === movie
                ? Object.assign({}, el, { rating: votes })
                : el
            )
          });
        });
    }
  }

  /**
   * Will add movie to the current contract and state.
   * @param {[type]} movie [description]
   */
  addMovie(movie) {
    let app = this;
    ratingContract.methods
      .addNewMovie(movie)
      .send({ from: account0 }, (error, hash) => {
        if (!error) {
          let newMovie = { name: movie, rating: 0 };
          app.setState({ movies: [...app.state.movies, newMovie] });
        } else {
          console.log(error);
        }
      });
    console.log(this.state.movies);
  }

  /**
   * Increment the vote by 1 when clicking movie in table.
   * @param  {[type]} movie [description]
   * @return {[type]}       [description]
   */
  handleVoting(movie) {
    let app = this;
    ratingContract.methods
      .voteForMovie(movie)
      .send({ from: account0 }, (error, transactionHash) => {
        if (!error) {
          ratingContract.methods
            .totalVotesFor(movie)
            .call()
            .then(function(votes) {
              app.setState({
                movies: app.state.movies.map(el =>
                  el.name === movie
                    ? Object.assign({}, el, { rating: votes })
                    : el
                )
              });
            });
        }
      });
  }

  /**
   * Check that the submission is unique, then call rating.addMovie()
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.movieName);
    if (this.state.movies.some(e => e.name.toLowerCase() == this.state.movieName.toLowerCase())) {
      console.log("ERROR");
      this.setState({ showAlert: true });
    } else {
      this.addMovie(this.state.movieName);
    }
  }

  /**
   * Update state based on user input in form text box.
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  handleChange(event) {
    this.setState({ movieName: event.target.value });
  }

  /**
   * Returns a styled alert element.
   * @return {[type]} [description]
   */
  getAlert() {
    return (
      <Alert
        variant="danger"
        onClose={() => this.setState({ showAlert: false })}
        dismissible
      >
        <Alert.Heading>Duplicate movie!</Alert.Heading>
        <p>
          This movie is already in the movie list. You can only add unique
          movies.
        </p>
      </Alert>
    );
  }

  render() {
    const showAlert = this.state.showAlert;
    let alert;
    if (showAlert) {
      alert = this.getAlert();
    }
    return (
      <Container>
        <Row>Movie Rating Application in Ethereum and React</Row>
        {alert}
        <hr />
        <Row>
          <Col />
          <Col xs={6}>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col>
                  <Form.Control
                    size="lg"
                    type="text"
                    placeholder="Movie Name"
                    value={this.state.movieName}
                    onChange={this.handleChange}
                  />
                </Col>
                <Col>
                  <Button variant="primary" size="lg" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
            <hr />
            <Row className="movie-table">
              <ShowMovies movies={this.state.movies} vote={this.handleVoting} />
            </Row>
          </Col>
          <Col />
        </Row>
      </Container>
    );
  }
}

export default App;
