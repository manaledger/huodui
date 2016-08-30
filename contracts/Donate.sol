import "Owned.sol";

// 捐赠合约
contract Donate is Owned {

  // 捐赠支付方式：支付宝，微信，网银
  enum payType {payAlipay, payWX, payBank}

  DonateInfo[] public donates;

  // 捐赠信息
  struct  DonateInfo{
    uint id;                  // id
    uint projectId;           // 项目ID
    uint userId;              // 捐赠者ID
    uint donateTime;          // 捐赠时间
    uint ammount;             // 捐赠金额
    payType paytype;          // 支付方式
  }

  // 定义捐赠事件
  event Donate (uint id, uint pid, uint uid, uint itme, uint amount, uint ptype);

  // 捐赠函数
  function donate (uint pid, uint uid, uint ammount, uint ptype) onlyOwner returns (uint) {
    uint id = donates.length++;
    DonateInfo di = donates[id];
    di.id = id;
    di.projectId = pid;
    di.userId = uid;
    di.donateTime = now;
    di.ammount = ammount;
    di.paytype = payType(ptype);

    Donate(id, pid, uid, di.donateTime, ammount, ptype);
    return id;
  }

  function donateById(uint _id) constant returns (uint pid, uint uid, uint time, uint ammount, uint ptype) {
    if (_id <= donates.length){
      DonateInfo di = donates[_id];
      return (di.projectId, di.userId, di.donateTime, di.ammount, uint(di.paytype));
    }
  }

  function () {
    throw;
  }
}
