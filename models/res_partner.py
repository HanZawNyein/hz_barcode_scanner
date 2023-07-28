from odoo import api, fields, models


class ResPartner(models.Model):
    _inherit = 'res.partner'

    def barcode_scan_from_js(self, barcode):
        pass
