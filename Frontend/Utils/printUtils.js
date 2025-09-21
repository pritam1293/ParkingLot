class PrintUtils {
    static defaultStyles = `
        body { 
            font-family: monospace; 
            white-space: pre-line; 
            padding: 20px; 
            text-align: center; 
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
        }
        @media print { 
            body { margin: 0; padding: 10px; font-size: 12px; } 
        }
    `;

    static print(content, title = 'QuickPark Document', styles = null) {
        const printWindow = window.open('', '_blank');
        const finalStyles = styles || this.defaultStyles;

        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>${finalStyles}</style>
                </head>
                <body>
                    ${content}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() {
                                window.close();
                            }, 1000);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    static generateTicketContent(ticketData, isUpdated = false) {
        const { ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot } = ticketData;
        const updateText = isUpdated ? '\n*** UPDATED INFORMATION ***\nThis ticket contains updated details.' : '';
        const header = isUpdated ? 'QUICKPARK UPDATED TICKET' : 'QUICKPARK TICKET';

        return `
================================
      ${header}
================================
Ticket ID: ${ticketId}
Vehicle Number: ${vehicleNo}
Owner Name: ${ownerName}
Owner Contact: ${ownerContact}
Entry Date: ${entryDate}
Entry Time: ${entryTime}
Parking Spot: ${parkingSpot}
================================${updateText}
Please keep this ticket safe!
Present this ticket when exiting.
================================
        `.trim();
    }

    static generateBillContent(billData) {
        const {
            ticketId, vehicleNo, ownerName, ownerContact,
            vehicleType, duration, totalCost
        } = billData;

        const currentDateTime = DateTimeUtils.getCurrentDateTime();
        const paymentStatus = totalCost === 0 ? '🎉 FREE PARKING' : 'Payment Status: Due on Exit';

        return `
================================
     QUICKPARK BILL
================================
Date: ${currentDateTime.date}
Time: ${currentDateTime.time}

Ticket ID: ${ticketId}
Vehicle Number: ${vehicleNo}
Owner Name: ${ownerName}
Contact Number: ${ownerContact}
Vehicle Type: ${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}

--------------------------------
Parking Duration: ${duration}
Total Amount: ₹${totalCost}
--------------------------------

${paymentStatus}

================================
Thank you for using QuickPark!
Have a safe journey ahead! 🚗
================================
        `.trim();
    }

    static generateReceiptContent(receiptData) {
        const {
            receiptId, transactionDate, transactionTime,
            description, amount, paymentMethod
        } = receiptData;

        return `
================================
     QUICKPARK RECEIPT
================================
Receipt ID: ${receiptId}
Date: ${transactionDate}
Time: ${transactionTime}

Description: ${description}
Amount: ₹${amount}
Payment Method: ${paymentMethod}

================================
Thank you for your payment!
================================
        `.trim();
    }

    static printTicket(ticketData, isUpdated = false) {
        const content = this.generateTicketContent(ticketData, isUpdated);
        const title = isUpdated ?
            `Updated Parking Ticket - ${ticketData.ticketId}` :
            `Parking Ticket - ${ticketData.ticketId}`;

        this.print(content, title);
    }

    static printBill(billData) {
        const content = this.generateBillContent(billData);
        const title = `QuickPark Bill - ${billData.ticketId}`;

        this.print(content, title);
    }

    static printReceipt(receiptData) {
        const content = this.generateReceiptContent(receiptData);
        const title = `QuickPark Receipt - ${receiptData.receiptId}`;

        this.print(content, title);
    }

    // Convenience methods for backward compatibility
    static printParkingTicket(ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot) {
        const ticketData = {
            ticketId, vehicleNo, ownerName, ownerContact,
            entryDate, entryTime, parkingSpot
        };
        this.printTicket(ticketData, false);
    }

    static printUpdatedTicket(ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot) {
        const ticketData = {
            ticketId, vehicleNo, ownerName, ownerContact,
            entryDate, entryTime, parkingSpot
        };
        this.printTicket(ticketData, true);
    }

    static printVehicleBill(ticketId, vehicleNo, ownerName, ownerContact, vehicleType, duration, totalCost) {
        const billData = {
            ticketId, vehicleNo, ownerName, ownerContact,
            vehicleType, duration, totalCost
        };
        this.printBill(billData);
    }
}

// Export convenience functions for global access
function printTicket(ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot) {
    PrintUtils.printParkingTicket(ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot);
}

function printUpdatedTicket(ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot) {
    PrintUtils.printUpdatedTicket(ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot);
}

function printBill(ticketId, vehicleNo, ownerName, ownerContact, vehicleType, duration, totalCost) {
    PrintUtils.printVehicleBill(ticketId, vehicleNo, ownerName, ownerContact, vehicleType, duration, totalCost);
}