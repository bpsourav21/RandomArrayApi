export interface UserDto {
    email: String;
    phone: String;
    name: String;
}

export interface ProductDto {
    id: string;
    name: String;
    subName: String;
    description: String;
    categoryId: Number;
    price: Number;
    unit: String;
    img: String;
    carouselImg: [String];
    discount: Number;
    tags: [String], index: true
    type: String;
    created: Date;
    updated: Date;

}

export interface ShoppingCartDto {
    product: ProductDto
    quantity: number;
}

export interface OrderDto {
    orderNo: String;
    customerName: String;
    Address: String;
    areaId: Number;
    cart: ShoppingCartDto[];
    user: UserDto;
    total: Number;
    subTotal: Number;
    discount: Number;
    deliveryFee: Number;
    discountCode: String;
    isPaid: Boolean;
    created: Date;
    updated: Date;
}