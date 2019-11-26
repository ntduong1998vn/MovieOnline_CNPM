import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  Modal,
  Form,
  FormControl,
  FormGroup,
  ControlLabel
} from "react-bootstrap";
import ReactTable from "react-table";
import _ from "lodash";
import axios from "axios";
import Button from "components/CustomButton/CustomButton.jsx";
// import { getListGenres, deleteById, addNewGenre } from "../utils/GenreAPI";
import { API_BASE_URL } from "../constants/auth";
const requestData = (pageSize, page, sorted, filtered) => {
  return new Promise((resolve, reject) => {
    // You can retrieve your data however you want, in this case, we will just use some local data.
    var filteredData = [];
    axios
      .get(API_BASE_URL + "/api/genres/")
      .then(response => {
        filteredData = response.data;
        // You can use the filters in your request, but you are responsible for applying them.
        // if (filtered.length) {
        //   filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
        //     return filteredSoFar.filter(row => {
        //       return (row[nextFilter.id] + "").includes(nextFilter.value);
        //     });
        //   }, filteredData);
        // }
        // You can also use the sorting in your request, but again, you are responsible for applying it.
        const sortedData = _.orderBy(
          filteredData,
          sorted.map(sort => {
            return row => {
              if (row[sort.id] === null || row[sort.id] === undefined) {
                return -Infinity;
              }
              return typeof row[sort.id] === "string"
                ? row[sort.id].toLowerCase()
                : row[sort.id];
            };
          }),
          sorted.map(d => (d.desc ? "desc" : "asc"))
        );

        // You must return an object containing the rows of the current page, and optionally the total pages number.
        let res = {
          rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
          pages: Math.ceil(filteredData.length / pageSize)
        };
        // Here we'll simulate a server response with 500ms of delay.
        setTimeout(() => resolve(res), 500);
      })
      .catch(error => {
        console.log(error);
      });
  });
};

class Genre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      pages: 0,
      showDialog: false,
      selectedGenre: null,
      error: null,
      showAddDialog: false,
      selectAll: false,
      checked: [],
      formData: {
        id: null,
        name: ""
      },
      error: "",
      showEditDialog: false
    };
    this.fetchData = this.fetchData.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSingleDelete = this.handleSingleDelete.bind(this);
    this.handleShowDeleteDialog = this.handleShowDeleteDialog.bind(this);
    this.handleShowAddGenreDialog = this.handleShowAddGenreDialog.bind(this);
    this.handleAllCheckboxChange = this.handleAllCheckboxChange.bind(this);
    this.handleSingleCheckboxChange = this.handleSingleCheckboxChange.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowEditDialog = this.handleShowEditDialog.bind(this);
    this.handleChooseEdit = this.handleChooseEdit.bind(this);
  }

  componentDidMount() {
    // TODO
  }

  handleAllCheckboxChange = () => {
    const selectAll = !this.state.selectAll;
    this.setState({ selectAll: selectAll });
    const checkedCopy = [];
    this.state.data.forEach((e, index) => {
      checkedCopy.push(selectAll);
    });
    this.setState({
      checked: checkedCopy
    });
  };

  handleSingleCheckboxChange = index => {
    const checkedCopy = this.state.checked;
    checkedCopy[index] = !this.state.checked[index];
    if (checkedCopy[index] === false) {
      this.setState({ selectAll: false });
    }

    this.setState({
      checked: checkedCopy
    });
  };

  handleSingleDelete = genre => {
    this.setState({ selectedGenre: genre });
    this.handleShowDeleteDialog();
  };

  handleShowDeleteDialog = () => {
    this.setState({ showDialog: !this.state.showDialog });
  };

  handleDelete = () => {
    console.log(API_BASE_URL + "/api/genres/" + this.state.selectedGenre.id);
    axios
      .delete(API_BASE_URL + "/api/genres/" + this.state.selectedGenre.id)
      .then(response => {
        this.props.handleClick("tc", 1, "Xoá thành công !");
      })
      .catch(error => {
        this.props.handleClick("tc", 3, "Xoá thất bại ! " + error.message);
        console.log(error);
      });
    this.setState({
      selectedGenre: null,
      showDialog: !this.state.showDialog
    });
  };

  handleShowAddGenreDialog = () => {
    this.setState({ showAddDialog: !this.state.showAddDialog });
  };

  handleShowEditDialog = () => {
    this.setState({ showEditDialog: !this.state.showEditDialog });
  };

  handleChooseEdit = genre => {
    const { formData } = this.state;
    formData.id = genre.id;
    formData.name = genre.name;
    this.setState({
      formData: formData,
      showEditDialog: true,
      selectedGenre: genre
    });
  };

  handleEdit = () => {
    const endpoint =
      API_BASE_URL + "/api/genres/" + this.state.selectedGenre.id;
    axios
      .put(endpoint, this.state.formData)
      .then(response => {
        this.props.handleClick("tc", 1, "Cập nhật thành công !");
      })
      .catch(error => {
        this.props.handleClick("tc", 3, "Lỗi !" + error.response.data);
      });
  };

  handleChange = event => {
    // const { name, value } = event.target;
    // const validRegex = RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/);
    // let { formData, error } = this.state;
    // formData.name = value;
    // switch (name) {
    //   case "name":
    //     error = validRegex.test(value)
    //       ? "Tên không phù hợp ! Yêu cầu nhập lại tên mới"
    //       : "";
    // }
    const { formData } = this.state;
    if (event.target.name === "id") formData.id = Number(event.target.value);
    else formData.name = event.target.value;
    this.setState({ formData: formData });
  };

  fetchData(state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    this.setState({ loading: true });
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    requestData(state.pageSize, state.page, state.sorted, state.filtered).then(
      res => {
        this.setState({
          data: res.rows,
          pages: res.pages,
          loading: false
        });
      }
    );
  }

  handleSubmit = event => {
    event.preventDefault();
    const { formData, error } = this.state;
    if (error.length > 0) this.props.handleClick("tc", 3, error);
    else {
      const endpoint = API_BASE_URL + "/api/genres/";
      axios
        .post(endpoint, formData)
        .then(response => {
          if (response.status === 201) {
            this.props.handleClick("tc", 1, "Đã thêm thành công!"); // Hiển thị thông báo thành công
            this.handleShowAddGenreDialog(); // Tắt hiển thị form thêm mới
          }
        })
        .catch(error => {
          this.props.handleClick("tc", 3, error.response.data); // Hiển thị thông báo thành công
          console.log(error.response);
        });
    }
  };

  render() {
    const {
      data,
      pages,
      loading,
      showDialog,
      showAddDialog,
      showEditDialog,
      selectAll,
      selectedGenre
    } = this.state;
    const columns = [
      {
        Header: (
          <input
            type="checkbox"
            onChange={this.handleAllCheckboxChange}
            checked={selectAll}
          />
        ),
        Cell: row => (
          <React.Fragment>
            <input
              type="checkbox"
              checked={this.state.checked[row.index]}
              onChange={() => this.handleSingleCheckboxChange(row.index)}
            />
          </React.Fragment>
        ),
        sortable: false,
        filterable: false,
        maxWidth: 50
      },
      {
        Header: "Mã thể loại",
        accessor: "id",
        maxWidth: 200
      },
      {
        Header: "Tên thể loại",
        accessor: "name"
      },
      {
        id: "function",
        Header: "Chức năng",
        sortable: false,
        accessor: () => "edit_delete",
        Cell: (row, index) => (
          <React.Fragment>
            <span
              onClick={() => this.handleChooseEdit(row.original)}
              style={{
                cursor: "pointer",
                color: "#1DC7EA",
                fontSize: "22px",
                margin: "0 10px"
              }}
            >
              <i className="fa fa-edit" />
            </span>
            <span
              onClick={() => this.handleSingleDelete(row.original)}
              style={{
                cursor: "pointer",
                color: "red",
                fontSize: "22px",
                margin: "0 10px"
              }}
            >
              <i className="fa fa-times" />
            </span>
          </React.Fragment>
        )
      }
    ];

    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col md={12} style={{ marginBottom: "5px" }}>
              {showAddDialog ? (
                <Form onSubmit={this.handleSubmit} inline>
                  <FormGroup>
                    <ControlLabel style={{ marginRight: "10px" }}>
                      ID
                    </ControlLabel>
                    <FormControl
                      type="number"
                      min="0"
                      id="id"
                      name="id"
                      onChange={this.handleChange}
                      placeholder="Điền ID"
                    />
                    <ControlLabel style={{ marginRight: "10px" }}>
                      Tên thể loại
                    </ControlLabel>
                    <FormControl
                      type="text"
                      id="name"
                      name="name"
                      onChange={this.handleChange}
                      placeholder="Điền tên thể loại phim"
                    />
                  </FormGroup>

                  <Button simple fill bsStyle="info" type="submit">
                    <i className="fa fa-check-circle"></i>
                  </Button>
                  <Button
                    simple
                    fill
                    bsStyle="danger"
                    simple
                    onClick={this.handleShowAddGenreDialog}
                  >
                    <i className="fa fa-times" />
                  </Button>
                </Form>
              ) : (
                <Button
                  className="btn btn-fill btn-info"
                  onClick={this.handleShowAddGenreDialog}
                >
                  Thêm mới
                </Button>
              )}
            </Col>
            <Col md={12}>
              <ReactTable
                manual // Khai báo để  thông báo việc sắp xếp và phân trang sẽ do server quản lý
                data={data}
                columns={columns}
                pages={pages}
                loading={loading}
                defaultPageSize={10}
                noDataText="Not Found!"
                getTbodyProps={(state, rowInfo, column) => {
                  return {
                    style: {
                      textAlign: "center"
                    }
                  };
                }}
                onFetchData={this.fetchData}
                className="-striped -highlight"
              />
              {/* Dialog Delete */}
              <Modal show={showDialog} onHide={this.handleShowDeleteDialog}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <i className="fa fa-exclamation-circle"></i> Bạn có chắc
                    chắn xoá không ?
                  </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                  <Button bsStyle="primary" onClick={this.handleDelete}>
                    Yes
                  </Button>
                  <Button onClick={this.handleShowDeleteDialog}>No</Button>
                </Modal.Footer>
              </Modal>
              {/* Dialog Edit Genre */}
              <Modal show={showEditDialog} onHide={this.handleShowEditDialog}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <i
                      className="fa fa-edit"
                      style={{ marginRight: "15px" }}
                    ></i>
                    Edit Form
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form inline>
                    <FormGroup>
                      <ControlLabel style={{ marginRight: "10px" }}>
                        ID
                      </ControlLabel>
                      <FormControl
                        type="number"
                        id="id"
                        name="id"
                        defaultValue={
                          selectedGenre !== null ? selectedGenre.id : 0
                        }
                        disabled
                      />
                      <ControlLabel style={{ marginRight: "10px" }}>
                        Tên thể loại
                      </ControlLabel>
                      <FormControl
                        type="text"
                        id="name"
                        name="name"
                        onChange={this.handleChange}
                        defaultValue={
                          selectedGenre !== null ? selectedGenre.name : ""
                        }
                        placeholder="Điền tên thể loại phim"
                      />
                    </FormGroup>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button bsStyle="primary" onClick={this.handleEdit}>
                    Edit
                  </Button>
                  <Button onClick={this.handleShowEditDialog}>No</Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Genre;
