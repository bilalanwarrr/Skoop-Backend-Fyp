const cron = require('node-cron');

const Order = require('../models/orders');
const Customer = require('../models/customers');
const Conversation = require('../models/conversation');
var notifications = require('../middleware/pushNotification');
var FoodItem = require('../models/food_items');
var Restaurant = require('../models/restaurants');

const StockProducts = require('../models/stock_products');

exports.autoOrderStock = async () => {
	cron.schedule('*/10 * * * * *', async () => {
        console.log("Hello Jee")
		const product = await StockProducts.find({ quantity: { $lt: 10 } })

		product.forEach(async document => {
            await StockProducts.findByIdAndUpdate( document._id, {
                quantity: document.quantity + 100
            })
			
		});
	});
};

exports.assignOrder = async () => {
	cron.schedule('*/10 * * * * *', async () => {
        console.log("Hello Sup")
		const orders = await Order.find({ requested: true, status: 0 }).populate('address').populate('customer');

		orders.forEach(async document => {
            distanceTemp = Infinity;
            setUser = null;

            if (Date.now() >= document.time + 60000){

                
                for (let i = 0; i < document.requests.length; i++){
                    console.log(document.requests[i])
                    
                    if (document.requests[i].distance < distanceTemp){
                        
                        setUser =  document.requests[i].user;
                        distanceTemp = document.requests[i].distance
                    }
                }
                
    
                var ids = [];
                for (let i = 0; i < document.foodItems.length; i++) {
                    const rest = await FoodItem.findById(document.foodItems[i].item).populate(
                        'restaurant'
                    );
                    ids.push(rest.restaurant.fcm);
                }
                
                const selectedUser = await Customer.findById(
                    setUser
                )
                console.log(selectedUser)
                let messageRes = `${selectedUser.full_name} is coming to pick up order#${document.id}`;
                let messageCus = `${selectedUser.full_name} has accepted to pick up your requested order#${document.id}`;
                await notifications.sendPushNotification(ids, messageRes);
                await notifications.sendPushNotification([document.customer.fcm], messageCus);
    
                var remainingTime = Math.ceil(
                    (distanceTemp * 1000) / (selectedUser.speed * 16.667)
                );
                remainingTime = `${remainingTime} minutes`;
                const newConversation = new Conversation({
                    members: [selectedUser._id, document.customer],
                });
                await Order.findByIdAndUpdate(document._id, {
                    scooper: selectedUser._id,
                    $inc: { status: 1 },
                    remainingTime,
                });
                await newConversation.save();
                        
                    
            }
        });
	});
};