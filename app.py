import io,os
import re
import string
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchvision import models
from flask import Flask, jsonify, request, render_template, redirect
from PIL import Image


app = Flask(__name__)


#Modelling Task
model = models.resnet18()
num_inftr = model.fc.in_features
model.fc = nn.Linear(num_inftr, 5)
model.load_state_dict(torch.load('./fix_resnet18.pth'))
model.eval()


class_names = ['Aloe vera', 'Cactus','Lotus','Massengena',  'Pennywort']
class_url =['https://anhdep123.com/wp-content/uploads/2020/10/hinh-anh-cay-nha-dam-dep.jpg',
           'https://sudospaces.com/thichtrongcay/2020/12/screen-shot-2020-12-14-at-5-16-40-pm.png',
           'https://kienthucmoi.net/img/2021/05/18/hoa-sen-3.jpg',
           'https://www.ikea.com/mx/en/images/products/dracaena-massangeana-potted-plant-dom-plant-3-stem__0900039_pe594233_s5.jpg?f=s',
           'https://caythuoc.org/wp-content/uploads/2017/07/cay-rau-ma.jpg'
           ,'https://png.pngtree.com/png-vector/20190115/ourlarge/pngtree-arrow-circle-l-rotate-icon-vector-design-png-image_316058.jpg']

def transform_image(image_bytes):
	my_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
	])

	image = Image.open(io.BytesIO(image_bytes))
	return my_transforms(image).unsqueeze(0)


def get_prediction(image_bytes):
	tensor = transform_image(image_bytes=image_bytes)
	outputs = model.forward(tensor)
	_, prediction = torch.max(outputs, 1)
	print(prediction)
	return class_names[prediction]

# Kiem tra ten cua cay de lay link anh
def check_image(name_image):
    pos = class_names.index(name_image)
    return  class_url[pos]

# Treat the web process
@app.route('/')
def AI_engine():
    return render_template('index.html')


@app.route('/submit', methods=['GET', 'POST'])
def upload_file():
	if request.method == 'POST':
		if 'file' not in request.files:
			return redirect(request.url)
		file = request.files.get('file')
		if not file:
			return
		img_bytes = file.read()
		prediction_name = get_prediction(img_bytes)
		url_name = check_image(prediction_name)    # tra ve link anh tĩnh để truyền vào result.html
		return render_template('result.html.',url_image =url_name, description=prediction_name)
		# return jsonify(prediction_name)

if __name__ == "__main__":
    app.run(debug=True)