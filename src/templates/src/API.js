export default class API {
    static async createCustomer(customer) {
        return await fetch("http://localhost:8080/api/customer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        })
        .then(response => response.json())
        .then(data => data);
    }

    static async authCustomer({email, password}) {
        return await fetch("http://localhost:8080/api/customer", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${email} ${password}`
            }
        })
        .then(response => response.json())
        .then(data => data)
    }
}