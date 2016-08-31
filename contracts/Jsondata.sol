import "Owned.sol";

// Json数据
contract Jsondata is Owned {

  mapping (bytes32 => string) public datas;

  // 定义事件
  event Jsondata (bytes32 id, string json);

  function saveJson(bytes32 key, string json) onlyOwner {
    if (key == bytes32("")) throw;
    bytes memory da = bytes(datas[key]);
    if (da.length > 0) throw;
    bytes memory db = bytes(json);
    if (db.length == 0) throw;
    datas[key] = json;
    Jsondata(key, json);
  }

  function getJson(bytes32 key) constant returns (string) {
    return datas[key];
  }

  function () {
    throw;
  }
}
