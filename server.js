// B1: Require framework express
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

// B2:
// Tạo ra 1 biến app/server đại diện cho toàn bộ chương trình
// code ở trên server
const server = express();

// Sử dụng các package cài đặt thêm với server
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// B3:
// Định nghĩa cổng sẽ được mở ra ở trên server để hosting toàn
// bộ source của server
// (hosting trên địa chỉ của server (http://localhost, http://127.0.0.1))
const port = 3000;

// B4:
// Tạo ra và định nghĩa các HTTP request endpoint/url/api route
// Sẽ được server lắng nghe và tiếp nhận

server.get("/", (req, res) => {
  res.send("Hello World!");
});

// B4.1:

// GET - Lấy dữ liệu
// a. GET ALL - Lấy toàn bộ dữ liệu về 1 chủ đề
// Khi định nghĩa ra các endpoint, url
// Tên của của url/endpoint cũng bao hàm về việc
// chúng ta muốn thao tác với dữ liệu gì được lưu trữ ở trên server

// VD: GET (Lấy dữ liệu) về endpoint có chủ đề là users
server.get("/users", (req, res) => {
  let { job } = req.query;

  // Logic Đọc và tìm kiếm dữ liệu về users có trên server
  let data = fs.readFileSync("./data/users.json");
  data = JSON.parse(data);
  // Lôi query string ra và tiến hành tìm kiếm dữ liệu theo đúng query string
  // mà client gửi lên
  if (job) {
    // Nếu có query string --> Tiến hành tìm kiếm toàn bộ dữ liệu theo đúng query string
    // mà client gửi lên server

    data = data.filter((e, i) => e.job === job);
    res.json(data);
  } else {
    // Nếu không có query string -> Vẫn tiến hành gửi về toàn bộ dữ liệu về đúng chủ
    // đề khai báo trên endpoint (url)

    // Sau khi tìm xong thì trả về toàn bộ dữ liệu về users
    // Đối với dữ liệu dạng text, hoặc HTML
    // res.send() -- Response (Gửi trả về dữ liệu từ server)

    // Đối với kiểu dữ liệu json
    // res.json() -- Response(Gửi trả về dữ liệu json từ server)
    res.json(data);
  }
});

// b. GET ONE - Lấy dữ liệu về một phần tử duy nhất có trong
// chủ đề được định nghĩa trong endpoint (url)

// Khi muốn lấy dữ liệu về một phần tử duy nhất theo một điều
// kiện nào đó ---> ở url trên server phải định nghĩa ra 1 parameter (Tham số)
//
server.get("/users/:id", (req, res) => {
  // destructuring object (trong Javascript)
  // B1: Lấy ra id người dùng gửi lên trong GET request thông qua params (parameter)
  let { id } = req.params;

  // B2: Đọc file users.json
  let data = fs.readFileSync("./data/users.json");
  data = JSON.parse(data);

  // B3: Tiến hành tìm kiếm phần tử đối tượng {} có trong file users.json
  // mà có id === id mà client gửi lên từ params

  let user = data.find((e, i) => e.id === Number(id));
  // {} | undefined

  if (user) {
    res.json(user);
  } else {
    res.json({
      message: "User not found",
    });
  }
});

// B4.2:

// POST - Thêm mới dữ liệu theo đúng chủ đề được định nghĩa trên url (endpoint)
server.post("/users", routerMiddleware, (req, res) => {
  console.log(req.body);

  // Tạo ra 1 đối tượng mới đúng với nguyên mẫu có trong file users.json
  let user = {
    id: Math.random(),
    ...req.body,
  };

  // Tiến hành đọc file users.json và thêm mới dữ liệu vào trong file users.json
  // đó thông qua câu lệnh ghi file fs.writeFileSync
  let data = fs.readFileSync("./data/users.json");
  data = JSON.parse(data);

  // push
  data.push(user);

  // Ghi đè data mới vào trong file `users.json`
  fs.writeFileSync("./data/users.json", JSON.stringify(data));

  /// Logic
  res.json({
    message: "Create user successfully",
  });
});

// B4.3:

// PUT - Cập nhật toàn bộ dữ liệu của phần tử
// theo đúng chủ đề được định nghĩa trên url

server.put("/users/:id", routerMiddleware, (req, res) => {
  // Logic
  // Tiến hành trích xuất id để tìm kiếm đúng phần tử có id trong parameter
  let { id } = req.params;

  // Tiến hành trích xuất thông tin client gửi lên từ req.body
  // Tiến hành đọc file users.json và tìm kiến phần tử đúng với id trong parameter
  let data = fs.readFileSync("./data/users.json");
  data = JSON.parse(data);

  let user = data.find((e, i) => e.id === Number(id));

  // Tiến hành cập nhật dữ liệu và ghi đè lại vào file users.json
  let index = data.indexOf(user);
  data[index] = { ...user, ...req.body };
  fs.writeFileSync("./data/users.json", JSON.stringify(data));
  // Sau khi cập nhật thành công thì response về cho client một
  // message là "Update user successfully"
  res.json({
    message: "Update user successfully",
  });
});

// B4.4:

// PATCH - Cập nhật một phần dữ liệu của phần tử
// theo đúng chủ đề được định nghĩa trên url
server.patch("/users/:id", routerMiddleware, (req, res) => {
  // Logic
  // Tiến hành trích xuất id để tìm kiếm đúng phần tử có id trong parameter
  let { id } = req.params;

  // Tiến hành trích xuất thông tin client gửi lên từ req.body
  // Tiến hành đọc file users.json và tìm kiến phần tử đúng với id trong parameter
  let data = fs.readFileSync("./data/users.json");
  data = JSON.parse(data);

  let user = data.find((e, i) => e.id === Number(id));

  // Tiến hành cập nhật dữ liệu và ghi đè lại vào file users.json
  let index = data.indexOf(user);
  data[index] = { ...user, ...req.body };
  fs.writeFileSync("./data/users.json", JSON.stringify(data));
  // Sau khi cập nhật thành công thì response về cho client một
  // message là "Update user successfully"
  res.json({
    message: "Update user successfully",
  });
});
// B4.5

// DELETE - Xoá dữ liệu của một phần tử
// theo đúng chủ đề được định nghĩa trên url
server.delete("/users/:id", routerMiddleware, (req, res) => {
  // Logic
  // Tiến hành trích xuất id để tìm kiếm đúng phần tử có id trong parameter
  let { id } = req.params;

  // Tiến hành đọc file users.json và tìm kiến phần tử đúng với id trong parameter
  let data = fs.readFileSync("./data/users.json");
  data = JSON.parse(data);

  // Tìm kiếm
  let user = data.find((e, i) => e.id === Number(id));

  let index = data.indexOf(user);
  // Tiến hành xoá dữ liệu với phần tử vừa tìm được và ghi đè lại vào file users.json
  data.splice(index, 1);
  fs.writeFileSync("./data/users.json", JSON.stringify(data));
  // Sau khi xoá thành công thì response về cho client một
  // message là "Delete user successfully"
  res.json({
    message: "Delete user successfully",
  });
});

function routerMiddleware(req, res, next) {
  let { id } = req.params;
  // Thực thi các tác vụ lọc request
  // Thực thi các tác vụ nào đó dành cho các router cần phải sử dụng middleware
  let data = fs.readFileSync("./data/users.json");
  data = JSON.parse(data);
  let user = data.find((e, i) => e.id === Number(id));

  if (!user) {
    console.log("Inside middleware");
    res.json({
      message: "User not found",
    });
  } else {
    next();
  }
}

// B5: Cho server luôn được chạy trong một trạng thái
// luôn chờ, và lắng nghe các yêu cầu được gửi lên từ client
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
