<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{

    protected $fillable = [
        'filename', 'user_id', 'size', 'type', 'created_at', 'updated_at'
    ];

}
