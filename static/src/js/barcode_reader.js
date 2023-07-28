/** @odoo-module **/

import {registry} from "@web/core/registry";
import {Component, useState} from "@odoo/owl";
import core from 'web.core';
import Session from 'web.session';


class BarcodeReader extends Component {
    setup() {
        this.session = Session;
        core.bus.on("barcode_scanned", this, this._onBarcodeScanned);
        let company_data = this.env.services.company
        this.rpc = this.env.services.rpc
        this.state = useState({
            company_data: company_data,
            company_image_url: this.session.url("/web/image", {
                model: "res.company",
                id: company_data.currentCompany.id,
                field: "logo"
            }),
        });

        // console.log(company_data.currentCompany.name);
    };


    _onBarcodeScanned(barcode) {
        core.bus.off("barcode_scanned", this, this._onBarcodeScanned);
        this.rpc({
            model: "res.partner", method: "barcode_scan_from_js", args: [barcode],
        }).then(function (result) {
            if (result.action) {
                self.displayNotification({
                    title: _t("Success"), message: _t(result.action), type: 'success', sticky: true,
                });
            } else if (result.warning) {
                self.displayNotification({
                    title: _t("Warning"), message: _t(result.warning), type: 'warning'
                });
            }
            core.bus.on("barcode_scanned", self, self._onBarcodeScanned);
        });
    }
}

BarcodeReader.components = {};
BarcodeReader.template = "hz_barcode_scanner.BarcodeReader";

registry.category("actions").add("hz_barcode_scanner.action_barcode_js", BarcodeReader);
