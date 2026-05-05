<?php

use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\IncidentVoteController;
use App\Http\Controllers\PublicIncidentMapController;
use App\Http\Controllers\PublicIncidentShowController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');
Route::get('/view_map', PublicIncidentMapController::class)->name('view_map');
Route::inertia('/report_incident_form', 'report_incident_form')->name('report_incident_form');
Route::post('/reports', [IncidentReportController::class, 'store'])->name('reports.store');
Route::get('/reports/{incident}', PublicIncidentShowController::class)->name('reports.show');
Route::post('/reports/{incident}/votes', [IncidentVoteController::class, 'store'])->name('reports.votes.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
