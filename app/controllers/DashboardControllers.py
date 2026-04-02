from flask import render_template, request, session

class DashboardController:
    @staticmethod
    def index(current_user):
        return render_template('dashboard/index.html', current_user=current_user)