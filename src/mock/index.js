module.exports = {

    // 支持标准 HTTP
    'GET user/register': { users: [1, 2] },
    'DELETE /api/users': { users: [1, 2] },
  
    // 支持参数
    'POST /api/users/:id': (req, res) => {
      const { id } = req.params;
      res.send({ id: id });
    },
  };