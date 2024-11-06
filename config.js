module.exports = {
    database: {
        host: '172.18.0.1',
        port: 3306,
        user: 'u1_ibnSltSWbK',
        password: 'wg4XU!^pWnUQj8WoH=SLp4^q',
        database: 's1_virtualx',
        connect: function() {
            return `mysql://u1_ibnSltSWbK:wg4XU!%5EpWnUQj8WoH%3DSLp4%5Eq@172.18.0.1:3306/s1_virtualx`;
        }
    },
    util: {
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
}