sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], (Controller, JSONModel, Filter, FilterOperator, Formatter) => {
    "use strict"

    return Controller.extend("ui5.walkthrough.controller.InvoiceList", {
        onInit() {
            const oInvoice = new JSONModel();
            this.formater = Formatter
            oInvoice.loadData("../Invoices.json");
            oInvoice.attachRequestCompleted(() => {
                const statusSet = new Set(["All", ...oInvoice.getData().Invoices.map(e => e.Status)])
                const statuses = Array.from(statusSet)
                
                const oStatusModel = new JSONModel({
                    statusCollection: statuses.map(status => {return {key: status, text: status}})
                })
                this.getView().setModel(oStatusModel, "allStatuses");
            });

            const oViewModel = new JSONModel({
                currency: "EUR"
            });
            this.getView().setModel(oViewModel, "view")
        },

        onFilterInvoices(oEvent) {
            const aFilter = [];
            const sQuery = oEvent.getParameter("query")
            
            if(sQuery){
                aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery))
            }

            const oList = this.byId("invoiceList");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter);
        },

        onPress(oEvent){
            const oItem = oEvent.getSource();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("detail", {
                invoicePath: window.encodeURIComponent(oItem.getBindingContext("invoice").getPath().substring(1))
            }
            );
        },

        onSelectionChange(oEvent){
            const aFilter = [];
            const sStatusCode = oEvent.getParameter("selectedItem").getKey()

            const oList = this.byId("invoiceList");
            const oBinding = oList.getBinding("items");

            if (sStatusCode && sStatusCode !== "All") {
                const oStatusFilter = new sap.ui.model.Filter({
                    path: "Status",
                    operator: sap.ui.model.FilterOperator.EQ,
                    value1: sStatusCode
                })
                aFilter.push(oStatusFilter);
            }
            oBinding.filter(aFilter, sap.ui.model.FilterType.Application)
    }
});
}); 