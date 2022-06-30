const CF = artifacts.require('./ChitFunds.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('CF', ([deployer, seller, buyer]) => {
  let c

  before(async () => {
    c = await CF.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await c.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await c.name()
      assert.equal(name, 'ChitFunds')
    })
  })
  
  describe('groups', async () => {
    let result,userCount 
    before(async () => {
      result =  await c.createUser('Guru','P','guru@gmail.com','asd')
      userCount = await c.userCount
    })

    it('create user', async () => {
      assert.equal(userCount, 1)
      const event = result.logs[0].args
      assert.equal(event._firstname,'Guru','name is correct')
      assert.equal(event._lastname,'P','name is correct')
      assert.equal(event._email,'guru@gmail.com','email is correct')
      assert.equal(event._password,'asd','duration is correct')

      await c.createUser('','P','guru@gmail.com','asd').should.be.rejected;

      
    })
  })
  





  })