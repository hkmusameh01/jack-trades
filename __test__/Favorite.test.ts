import request from "supertest";

import app from "../server/app";
import sequelize from "../server/database/connection";
import buildTables from "../server/database/build";

const token = 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJKb2huQGdtYWlsLmNvbSIsImlhdCI6MTY2NjY5OTQxNn0.JczMifcbYE9z53Lmt9IL_QV7z3D7YA2wn0zZIFGwwjk';
beforeAll(() => buildTables());
// checkReqFav router
describe("check user wishList route", () => {

    it("Should return true if the product exists in the usr's wishList", async () => {
        await request(app)
            .get("/api/v1/requests/checkFavReq/1")
            .expect(200)
            .set('Cookie', token)
            .expect("Content-Type", /json/)
            .expect((res) => expect(res.body).toEqual(true));
    });

    it("Should return false if the product doesn't exist in the usr's wishList", async () => {
        await request(app)
            .get("/api/v1/requests/checkFavReq/2")
            .expect(200)
            .set('Cookie', token)
            .expect("Content-Type", /json/)
            .expect((res) => expect(res.body).toEqual(false));
    });

    it("Should return 401 and Unauthorized if the user doesn't signIn", async () => {
        await request(app)
            .get("/api/v1/requests/checkFavReq/2")
            .expect(401)
            .set('Cookie', `${token}1`)
            .expect("Content-Type", /json/)
            .expect({
                message: 'Unauthorized'
            });
    });

});

// add to wishlist route
describe("Add to wishlist route", () => {
    it("Should return 201 and (added successfully, message) when the user added the product to the wishList", async () => {
        await request(app)
            .post("/api/v1/wishlist/5")
            .expect(201)
            .set('Cookie', token)
            .expect((res) => {
                expect(res.text).toEqual('You added the product to the wishlist successfully')
            });


    });

    it("Should return 400 and (error message) when the user try to add same product to the wishList again", async () => {
        await request(app)
            .post("/api/v1/wishlist/5")
            .expect(400)
            .set('Cookie', token)
            .expect((res) => {
                expect(res.body).toEqual({ message: 'This item is already exist in the WishList' });
            });
    });

    it("Should return 400 and (Bad request message) when the user added invalid product id in the params", async () => {
        await request(app)
            .post("/api/v1/wishlist/ss") // ss >> is invalid id 
            .expect(400)
            .set('Cookie', token)
            .expect((res) => {
                expect(res.body).toEqual({ message: 'Bad Request' });
            });

    });

    it("Should return 401 and Unauthorized if the user doesn't signIn", async () => {
        await request(app)
            .post("/api/v1/wishlist/2")
            .expect(401)
            .set('Cookie', `${token}sqs`)
            .expect("Content-Type", /json/)
            .expect({ message: 'Unauthorized' })
    });

});

// Delete from wishlist route
describe("delete from wishlist route", () => {
    it("Should return 200 and (deleted successfully, message) when the user delete the product from the wishList", async () => {
        await request(app)
            .delete("/api/v1/wishlist/1")
            .expect(200)
            .set('Cookie', token)
            .expect((res) => {
                expect(res.text).toEqual('You removed the product from the wishlist successfully')
            });
    });

    it("Should return 400 and (error message) when the user try to delete the same product again", async () => {
        await request(app)
            .delete("/api/v1/wishlist/1")
            .expect(400)
            .set('Cookie', token)
            .expect("Content-Type", /json/)
            .expect({ message: 'This item is already removed from your wishlist' });
    });

    it("Should return 400 and (error message) when the user added invalid product id in the params", async () => {
        await request(app)
            .delete("/api/v1/wishlist/sqe1") // sqs1 is a invalid id 
            .expect(400)
            .set('Cookie', token)
            .expect("Content-Type", /json/)
            .expect({ message: 'Bad Request' });
    });
    
    it("Should return 401 and Unauthorized if the user doesn't signIn", async () => {
        await request(app)
            .delete("/api/v1/wishlist/3")
            .expect(401)
            .set('Cookie', `token`)
            .expect("Content-Type", /json/)
            .expect({ message: 'Unauthorized' });
    });
});
afterAll(() => sequelize.close());