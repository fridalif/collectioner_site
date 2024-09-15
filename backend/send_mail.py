import smtplib
from email.message import EmailMessage
import psycopg2

# Параметры подключения
db_params = {
    'dbname': 'collectioner_db',
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',  
    'port': '5432'  
}

try:
    connection = psycopg2.connect(**db_params)
    cursor = connection.cursor()
    cursor.execute("SELECT custom_user.id, activate_hash, email FROM custom_user LEFT JOIN auth_user on custom_user.user_id = auth_user.id;")
    rows = cursor.fetchall()
    for row in rows:
        print(row)

except Exception as e:
    print(f"Ошибка: {e}")

finally:
    # Закрываем курсор и соединение
    if cursor:
        cursor.close()
    if connection:
        connection.close()





# Формирование сообщения
#message = EmailMessage()
#message['Subject'] = 'Тема сообщения'
#message['From'] = 'serb.2002@mail.ru'
#message['To'] = 'fridalif2@gmail.com'
#message.set_content('Вечный двигатель — это миф!')
#
#with smtplib.SMTP_SSL('smtp.mail.ru', 465) as smtp:
#    smtp.login('serb.2002@mail.ru', 'aJfThQ6jpngxqJsxMeEm')
#    smtp.send_message(message)