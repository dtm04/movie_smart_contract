import React, { Component } from "react";
import { Table, Container } from "react-bootstrap";
import "./ShowMovie.css";

export class ShowMovies extends Component {
  handleChange = movie => {
    let _movie = movie;
    this.props.vote(_movie);
  };

  render() {
    let movieList = this.props.movies;
    movieList.map((movie, i) => (
      <tr key={i}>
        <td onClick={this.handleChange.bind(this, movie.name)}>{movie.name}</td>
        <td>{movie.rating}</td>
      </tr>
    ));

    return (
      <Container>
        <Table>
          <thead>
            <tr>
              <th>Movie</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>{movieList}</tbody>
        </Table>
      </Container>
    );
  }
}

module.export = ShowMovies;
