# Quick-Tip-Backend
The server side of Quick-Tip

## Stage
- Project is in development，the source code is in the dev branch.
- Code will be rebased and merged into master branch after development and test.

## 技术栈
- 后端框架：Koa.js（以及一系列相应中间件）
- 数据库：Mysql
- 库：
	- Mysql 库：Mysqljs + 手动封装 async/await
	- 时间处理库：Moment.js
	- Websocket 库：ws
- 身份认证：JWT
- 服务器：Nginx 反向代理 + PM2 负载均衡 + Node 服务器


## 前后端交互 API 
- 项目已部署至 crcrcry.com.cn
- API 接口如下，所有未写可选的参数都必填
- POST 请求请用 x-www-form-urlencoded 形式

---

1. 注册
	- POST /user/register
	- 参数：用户名username、密码password、验证密码verify、昵称nickname（可选）、类型user_type（0 消费者，1 服务生，2 商家）
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：注册成功、该用户已存在）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		        employerName: string
		        allRewardMoney（消费者可用）
		    }
		}
		```

2. 登录
	- POST /user/login
	- 参数：用户名username、密码password、用户类型user_type
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：注册成功、该用户已存在）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		        employerName: string
		        allRewardMoney（消费者可用）
		    }
		}
		```

---
- 登录或注册后返回的 token 请存至前端本地，之后每次发送请求要用到。
- 此处向下 API，发送请求时需要添加 token，将 token 装进 headers['access-token'] 中。

---
3. 修改昵称
	- PUT /user
	- 参数：昵称nickname
	- 返回：
		
		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：修改成功）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		        employerName: string
		        allRewardMoney（消费者可用）
		    }
		}
		```

4. 获取用户最新信息
	- GET /user （其实访问一个不在路由表里的地址就可以获得最新的 token 和 userInfo）
	- 参数：无
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：修改成功）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		        employerName: string
		        allRewardMoney（消费者可用）
		    }
		}
		```

6. 商店增添雇佣关系
	- POST /user/relation
	- 参数：雇员名employee
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：雇佣成功）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		    }
		}
		```

7. 商店删除雇佣关系
	- DELETE /user/relation
	- 参数：雇员名employee
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：删除成功）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		    }
		}
		```

5. 商店获取手下的所有雇员
	- GET /user/relation
	- 参数：无
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：修改成功）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		      }
		      employee: [{
		        uid
		        username
		        nickname
		        user_type
		        balance
		        reward: {
		          moneySum
		          numSum
		          starAvg
		        }
		      }]
		    }
		}
		```

9. 增加一条打赏
	- POST /reward
	- 参数：服务生ID getter、商店ID shop、评星star、评论comment、金额money、桌号 desk
	- 说明：用户可以不写评论，此时，前端请求传 comment 为空字符串
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：打赏成功、余额不足）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		    }
		}
		```

8. 获取打赏列表
	- GET /reward?(token=&)waiter=&start=&end=&p=&psize
	- 参数：服务生ID waiter（服务生端不填）、起始时间start、结束时间end（start、end 都可不填）、请求的页数p、每页大小psize（p相关都可不填）
	- 参数说明：token 中反映了user_type 和 uid。时间采取 年-月-日 形式，格式位数不限。
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：修改成功）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		      }
		      rewardList: [{
		        id
		        getterID
		        getterNickname
		        setterID
		        setterNickname
		        shopID
		        shopNickname
		        money
		        comment
		        star
		        time
		        visible
		        dayTime: YYYY-MM-DD format
		      }]
		    }
		}
		```

10. 获取服务生平均星级
	- GET /user/star?getterID=
	- 参数：服务生ID getterID
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		     } 
		      star: 一位小数
		      nowShop
		}
		```

10. 钱包充值or提现
	- PUT /account
	- 参数：金额money
	- 说明：money 正负表示金额增减
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息（如：修改成功、余额不足）
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		     } 
		}
		```

11. 商店、服务生，获取自己下所有 nfc 设备列表
	- GET /nfc
	- 参数：无
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		     }
		      nfc:[
		        {
		          id
		          data: 描述信息
		          desktop_id
		          waiter_id
		          nickname（商店端使用）
		        }
		      ] 
		}
		```

12. 商店添加新的nfc设备
	- POST /nfc
	- 参数：data、desktop_id
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		     }
		}
		```

13. 客户获取该桌的商店、服务生信息
	- GET /nfc?shop_id=&desktop_id
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		      }
		      desktopInfo: {
		        shop_name
		        waiter_id
		        waiter_name
		      }
		    }
		}
		```

14. 服务生绑定/解绑一台nfc设备
	- PUT /nfc
	- 参数：shop_id、desktop_id、bind（0代表解绑，1代表绑定）
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		      }
		    }
		}
		```


14. 消费者设置打赏不可见（但服务生依然可见）
	- DELETE /reward
	- 参数：打赏id 
	- 返回：

		```
		{
		    code: 0（状态，0 代表成功，-1 代表失败）
		    msg: 信息
		    data:{
		      token
		      userInfo: {
		        username
		        nickname
		        user_type
		        balance
		      }
		    }
		}
		```