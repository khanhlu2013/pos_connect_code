from datetime import datetime

def exe():
	print "Hi welcome to guess the date!!"
	print "you have to guess the correct date or have something terribe happen!"
	now = datetime.now()
	user_month = raw_input("What is the month?")
	user_day = raw_input("What is the day?")
	user_year =raw_input("What is the year?")	

	if user_day != str(now.day): 
		print "wrong day"	

	if user_month != str(now.month): 
		print "wrong month"

	if user_year!= str(now.year): 
		print "wrong year"

	if user_year == str(now.year) and user_month == str(now.month) and user_day == str(now.day):
		print "correct"



def RY():
    answer = raw_input ("what number do you chose between 0-1000?")
    answer = int(answer)
    if answer > 0 and answer < 500:
        print "C!"
    elif answer > 500 and answer < 700:
        print "B!"
    elif answer > 700 and answer <= 1000:
        print "A"
    else:
        print "Try again LAST TRY"
        if answer > 0 and answer < 500:
            print "C!"
        elif answer > 500 and answer < 700:
            print "B!"
        elif answer > 700 and answer <= 1000:
            print "A"
        else:
            print "YOU ARE THE STUPIDIST PERSON EVERE YOU GET ---------------------F!!!!!!"