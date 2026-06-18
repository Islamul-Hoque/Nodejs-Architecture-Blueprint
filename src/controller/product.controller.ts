import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProducts } from "../service/products.service";
import type { IProducts } from "../types/products.type";
import { parseBody } from "../utility/parseBody";

export const productController =async (req: IncomingMessage, res: ServerResponse) => {

    const url = req.url;
    const method = req.method;

    const urlParts = url?.split("/")
    const id = urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null
    const products = readProducts()

    // All products "GET"
    if (method === "GET" && url === "/products") {
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "products retrieved successfully", data: products }));
    }

    // Single products "GET"
    else if(method === "GET" && id !==null ){
        const products = readProducts()
        const product = products.find((p: IProducts)=>p.id === id )

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Single product retrieved successfully", data: product }));
    }

    // Single product "POST"
    else if(method === "POST" && url === "/products" ){
        const products = readProducts()

        const body = await parseBody(req)
        const newProduct = {
            id: Date.now(),
            ...body
        }
        products.push(newProduct)
        insertProduct(products);
        // console.log(products);

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Single product created successfully", data: newProduct }));
    }

    // // Single products "PUT"
    // else if(method === "PUT" && id !== null){
    //     const body = await parseBody(req)
    //     const products = readProducts()

    //     // find product 
    //     const index = products.findIndex((p: IProducts)=>p.id === id)

    //     // Update product details
    //     products[index] = {id: products[index].id, ...body}

    //     // update product Array in database
    //     insertProduct(products);
    //     res.writeHead(200, { "content-type": "application/json" });
    //     res.end(JSON.stringify({ message: "Product updated successfully", data: products[index] }));

    //     // index Error handel
    //     if(index < 0) {
    //         res.writeHead(404, { "content-type": "application/json" });
    //         res.end(JSON.stringify({ message: "Product not found", data: null }));
    //     }
    // }
}

