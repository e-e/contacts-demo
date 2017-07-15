from flask import Flask
from flask_restful import reqparse, Resource, Api
from flask_cors import CORS
# from sqlalchemy import Table, Column, Integer, String, BoundMetaData, ForeignKey, create_engine
from sqlalchemy import *
from json import dumps


db = create_engine("sqlite:///contacts.db")
metadata = MetaData(db)
contacts = Table("contacts", metadata, autoload=True)


app = Flask(__name__)
api = Api(app)
CORS(app)

add_contact_parser = reqparse.RequestParser()
add_contact_parser.add_argument("first_name", type=str)
add_contact_parser.add_argument("last_name", type=str)
add_contact_parser.add_argument("birth_date", type=str)
add_contact_parser.add_argument("phone_number", type=str)
add_contact_parser.add_argument("zipcode", type=str)
add_contact_parser.add_argument("date_added", type=str)
add_contact_parser.add_argument("date_updated", type=str)

update_contact_parser = reqparse.RequestParser()
update_contact_parser.add_argument("contact_id", type=int)
update_contact_parser.add_argument("first_name", type=str)
update_contact_parser.add_argument("last_name", type=str)
update_contact_parser.add_argument("birth_date", type=str)
update_contact_parser.add_argument("phone_number", type=str)
update_contact_parser.add_argument("zipcode", type=str)
update_contact_parser.add_argument("date_added", type=str)
update_contact_parser.add_argument("date_updated", type=str)

delete_contact_parser = reqparse.RequestParser()
delete_contact_parser.add_argument("contact_id", type=int)


class Contact(Resource):
	def get(self, contact_id):
		s = contacts.select(contacts.c.contact_id == contact_id)
		rs = s.execute()
		result = {'data': [dict(zip(tuple (rs.keys()) ,i)) for i in rs.cursor]}
		return result

class Contacts_List(Resource):
	def get(self):
		# s = contacts.select()
		# rs = s.execute()

		stmt = select([contacts.c.contact_id, contacts.c.first_name, contacts.c.last_name, contacts.c.phone_number, contacts.c.birth_date, contacts.c.zipcode, contacts.c.date_added, contacts.c.date_updated]);
		rs = db.execute(stmt)

		result = {'data': [dict(zip(tuple (rs.keys()) ,i)) for i in rs.cursor]}
		return result



class Add_Contact(Resource):
	def post(self):
		args = add_contact_parser.parse_args()
		i = contacts.insert()
		res = i.execute(
			first_name=args["first_name"],
			last_name=args["last_name"],
			birth_date=args["birth_date"],
			phone_number=args["phone_number"],
			zipcode=args["zipcode"],
			date_added=args["date_added"],
			date_updated=args["date_updated"]
		)
		return '{ "action": "add", "contact_id": ' + str(res.lastrowid) + ', "success": 1 }'

class Update_Contact(Resource):
	def put(self):
		args = update_contact_parser.parse_args()
		u = contacts.update(contacts.c.contact_id == args["contact_id"])

		u.execute(
			first_name=args["first_name"],
			last_name=args["last_name"],
			birth_date=args["birth_date"],
			phone_number=args["phone_number"],
			zipcode=args["zipcode"],
			date_added=args["date_added"],
			date_updated=args["date_updated"]
		)
		return '{ "action": "update", "success": 1 }'

class Delete_Contact(Resource):
	def get(self, contact_id):
		d = contacts.delete(contacts.c.contact_id == contact_id)
		d.execute()
		return '{ "action": "delete", "success": 1 }'


api.add_resource(Contacts_List, '/contacts')
api.add_resource(Contact, '/contacts/<int:contact_id>')
api.add_resource(Add_Contact, '/add')
api.add_resource(Update_Contact, '/update')
api.add_resource(Delete_Contact, '/delete/<int:contact_id>')

if __name__ == "__main__":
	app.run()


