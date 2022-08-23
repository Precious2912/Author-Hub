import app from '../src/app'
import supertest from 'supertest'
const request = supertest(app)
import bcrypt from 'bcryptjs'

describe('test users endpoints', () => {
    test("test get all users", async()=>{
        const res = await request.get('/users/read')
        expect(res.status).toBe(200)
    });

    test("test get single user", async()=>{
        const res = await request
                    .get('/users/read/id')
                    .send({id: "c4d31c62-5517-4402-91f1-70e9a5997419"})
        expect(res.status).toBe(200)
    });

    test("test signup user",async()=>{
        const res = await request
                    .post('/users/signup')
                    .send({
                        author: "Mercy Janice",
                        dateRegistered: 209005,
                        age: 32,
                        email: "janivjkvgfmhjn8@gmail.com",
                        password: 'seunayo',
                        confirm_password: 'seunayo',
                        address: "ffddfghj"
                    })
        expect(res.body).toHaveProperty('message')
    });

    test("test login user",async()=>{
        const res = await request
                    .post('/users/login')
                    .send({
                        email: "janivjkvgfmhjn8@gmail.com",
                        password: 'seunayo'
                    })
    //   expect(res.body).toHaveProperty('token')
    // expect(res.body.msg).toBe("login successfully")
    });

})



// describe('test books endpoints', () => {
    
// })