import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { FieldGroup } from "components/FieldGroup/FieldGroup";
import PosterCard from "components/PosterCard/PosterCard.jsx";
import { API_KEY, API_URL, IMAGE_BASE_URL, POSTER_SIZE } from "../config";
import { API_BASE_URL } from "../constants/auth";
import axios from "axios";

class MovieDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      movie: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.fetchMovie = this.fetchMovie.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { movie } = this.state;
    const { name, value } = e.target;
    if (
      name == "runtime" ||
      name == "popularity" ||
      name == "vote_average" ||
      name == "vote_count"
    )
      value = Number(value);

    let temp = { ...movie, [e.target.name]: e.target.value };
    this.setState({ movie: temp });
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const movieId = this.props.match.params.id;
    // const endpoint = `${API_URL}movie/475557?api_key=${API_KEY}&language=en-US`;
    const endpoint = `${API_BASE_URL}/api/movies/${movieId}`;
    this.fetchMovie(endpoint);
  }

  fetchMovie = endpoint => {
    axios
      .get(endpoint)
      .then(response => {
        console.log(response);
        this.setState({ movie: response.data, isLoading: false });
      })
      .catch(error => {
        console.log("MovieDetail Error : ", error);
      });
  };

  handleSubmit(event) {
    event.preventDefault();
    const { movie } = this.state;
    console.log(movie);
  }

  render() {
    const { movie, isLoading } = this.state;
    return (
      <div className="content">
        <Grid fluid>
          {isLoading ? (
            <Row>
              <p>Fetching data...</p>
            </Row>
          ) : (
            <Row>
              <Col md={8}>
                <Card
                  title="Edit Profile"
                  content={
                    <form onSubmit={this.handleSubmit}>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <ControlLabel>Mã phim</ControlLabel>
                            <FormControl.Static>{movie.id}</FormControl.Static>
                          </FormGroup>
                        </Col>
                        <Col md={8}>
                          <FieldGroup
                            name="title"
                            onChange={this.handleChange}
                            label="Tên phim"
                            type="text"
                            bsClass="form-control"
                            placeholder="Username"
                            defaultValue={movie.title}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FieldGroup
                            label="Số tập"
                            type="text"
                            bsClass="form-control"
                            placeholder="First name"
                            defaultValue="12/24"
                            disabled
                          />
                        </Col>
                        <Col md={6}>
                          <FieldGroup
                            name="release_date"
                            onChange={this.handleChange}
                            label="Ngày khởi chiếu"
                            type="date"
                            bsClass="form-control"
                            placeholder="Last name"
                            defaultValue={movie.release_date}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FieldGroup
                            label="Quốc gia"
                            type="text"
                            bsClass="form-control"
                            placeholder="Home Adress"
                            defaultValue="US"
                          />
                        </Col>
                        <Col md={6}>
                          <FieldGroup
                            name="runtime"
                            label="Thời lượng"
                            type="text"
                            bsClass="form-control"
                            placeholder="Home Adress"
                            onChange={this.handleChange}
                            defaultValue={movie.runtime}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FieldGroup
                            label="Độ phân giải"
                            type="text"
                            bsClass="form-control"
                            placeholder="City"
                            defaultValue="HD 720p"
                          />
                        </Col>
                        <Col md={4}>
                          <FieldGroup
                            name="original_language"
                            label="Ngôn ngữ"
                            type="text"
                            bsClass="form-control"
                            placeholder="Country"
                            onChange={this.handleChange}
                            defaultValue={movie.original_language}
                          />
                        </Col>
                        <Col md={4}>
                          <FieldGroup
                            label="Đạo diễn"
                            type="text"
                            bsClass="form-control"
                            placeholder="ZIP Code"
                            defaultValue="Jame Cameron"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>Thể loại</Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <FormGroup controlId="formControlsTextarea">
                            <ControlLabel>Nội dung</ControlLabel>
                            <FormControl
                              name="overview"
                              rows="10"
                              componentClass="textarea"
                              bsClass="form-control"
                              placeholder="Here can be your description"
                              value={movie.overview}
                              onChange={this.handleChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <Button bsStyle="info" pullRight fill type="submit">
                        Update Profile
                      </Button>
                      <div className="clearfix" />
                    </form>
                  }
                />
              </Col>
              <Col md={4}>
                <PosterCard
                  imageUrl={IMAGE_BASE_URL + POSTER_SIZE + movie.poster_path}
                  rounded
                  responsive
                />
              </Col>
            </Row>
          )}
        </Grid>
      </div>
    );
  }
}

export default MovieDetail;
