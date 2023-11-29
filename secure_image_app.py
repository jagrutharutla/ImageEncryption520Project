# app.py
from flask import Flask, render_template, request
import cv2
from Stratergies.Algo import AES
from flask_mail import Mail, Message

app = Flask(__name__)

# Flask mail configuration
app.config['MAIL_SERVER'] = 'smtp.googlemail.com' 
app.config['MAIL_PORT'] = 587  
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'imageproject520@gmail.com'
app.config['MAIL_PASSWORD'] = 'zukr fmas irkn tiii'

mail = Mail(app)

# Serve HTML, CSS, and JS files
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Check if the POST request has the file part
        if 'imageInput' not in request.files:
            return 'No file part'

        file = request.files['imageInput']

        # If the user submits an empty part without selecting a file, the browser sends an empty file
        if file.filename == '':
            return 'No selected file'

        # Save the file to the 'uploads' folder
        file.save('uploads/' + file.filename)

        return f'Image uploaded successfully: {file.filename}'

    return render_template('index.html')

encryption_keys = {}

@app.route('/encrypt', methods=['POST'])
def encrypt():
    key = request.form.get('key_en')
    # Validating the Key
    if not key: 
        return "Encryption key is required"
    
    # Get the filename of the uploaded image from the request
    image_filename = request.form.get('imageFilename')

    # Save key 
    encryption_keys[image_filename] = key

    # Check if the image filename is provided
    if not image_filename:
        return 'No image filename provided for encryption'

    # Construct the path of the uploaded image
    image_path = 'uploads/' + image_filename

    #image_path = 'uploads/cat.png'
    
    image_obj = cv2.imread(image_path)
    aes_obj = AES.encrypt(image_obj, key)  
    name = cv2.imwrite(image_path, aes_obj)

    return f'Image encrypted and saved successfully: {name}'

@app.route('/decrypt', methods=['POST'])
def decrypt():

    # Get the filename of the uploaded image from the request
    image_filename = request.form.get('imageFilename')

    # Retrieve saved encryption key
    key_en = encryption_keys.get(image_filename)
    
    key_de = request.form.get('key_de')

    if not key_de:
        return "Decryption key is required"

    # Check if the image filename is provided
    if not image_filename:
        return 'No image filename provided for encryption'

    # Construct the path of the uploaded image
    image_path = 'uploads/' + image_filename

    #image_path = 'uploads/cat.png'
    image_obj = cv2.imread(image_path)
    
    if key_de != key_en:
        return "Keys do not match"  
    try: 
        aes_obj = AES.decrypt(image_obj, key_de) 
        name = cv2.imwrite(image_path, aes_obj)
        # Decrypt and save
        return "Decryption success"
    except Exception as e:
        return "Decryption failed"
    
@app.route('/send_email', endpoint='send_email', methods=['POST'])
def index():
  if request.form.get('receiverEmail'):
    receiver_email = request.form.get('receiverEmail')  
    image = request.files.get('emailImage')
    
    msg = Message('Image Attachment', sender='my_email@gmail.com', recipients=[receiver_email])
    msg.attach(image.filename, "image/png", image.read())
    mail.send(msg)
    
    return "Email sent!"
  
  return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
