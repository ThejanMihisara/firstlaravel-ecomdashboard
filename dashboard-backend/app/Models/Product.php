<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'quantity',
        'image',
        'user_id',
    ];

    protected $appends = [
        'image_url',
    ];

    public function getImageUrlAttribute()
    {
        if (! $this->image) {
            return null;
        }

        return request()->getSchemeAndHttpHost().'/storage/'.$this->image;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
