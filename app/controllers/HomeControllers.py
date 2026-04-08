from flask import render_template


class HomeController:

    @staticmethod
    def index():
        return render_template('home/index.html')

    @staticmethod
    def premium():
        return render_template('home/premium.html')

    @staticmethod
    def features():
        return render_template('home/features.html')